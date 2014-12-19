Stripe = StripeAPI(MasterConfig.keys.stripe);

Fiber = Npm.require("fibers");
Future = Npm.require('fibers/future');

Meteor.methods({
  update_billing_info: function(stripe_card_token, last_4_card_number) {
    var userId = this.userId;

    if(Meteor.user().stripe_customer_token) {
      Stripe.customers.update(Meteor.user().stripe_customer_token, {
        card: stripe_card_token
      }, function(error, result) {
        if(error) {
          console.log('INVALID CARD!');
          console.log(error);
          return;
        }

        console.log('valid_card!');
        Fiber(function() {
          Meteor.users.update(userId, {$set: {
            valid_card: true,
            card_number: last_4_card_number
          }});
        }).run();
      });
    }
    else {
      //create new stripe customer
      Stripe.customers.create({
        card: stripe_card_token,
        email: Meteor.user().get_email()
      }, function(error, result) {
        if(error) {
          console.log('INVALID CARD!');
          console.log("STRIPE ERROR:", error);
          return;
        }

        console.log('valid_card!');
        Fiber(function() {
          Meteor.users.update(userId, {$set: {
            stripe_customer_token: result.id,
            valid_card: true,
            card_number: last_4_card_number
          }});
        }).run();
      });
    }
  },
  charge_order: function(order_id) {
    var order = Orders.findOne(order_id),
        // customer = Meteor.users.findOne(order.customer_id),
        user_id = order.user_id,
        error, result;

    console.log("********************************");
    console.log("INSIDE charge_order");
    console.log("********************************");
    console.log("ORDER IS", order._id);
    console.log("CUSTOMER IS", order.user_id);
    console.log("********************************");

    var user_id_interval = Meteor.setInterval(function() {
      if (Orders.findOne(order_id).user_id) {

        Stripe.charges.create({
          amount: order.cost*100,
          currency: "USD",
          user: Meteor.users.findOne(user_id).stripe_user_token
        }, function (error, result) {
          Fiber(function() {
            if(error != undefined) {
              console.log("ERROR WHILE CHARGING USER: ", error);
              console.log("AMOUNT WAS:", order.cost*100);
              Meteor.users.update(user_id, {$set: {valid_card: false}});
              Orders.update(order_id, {$set: {error: error, order_processed: true}});
            }
            //we'll use the stripe_charge_id to refund it if the deadline is missed. no more captures
            else {
              Orders.update(order_id, {$set: {paid: true, stripe_charge_id: result.id, order_processed: true, status: OrderStatuses.NEW}});
              order.celebrity().decrementAvailableInventory();
              Meteor.call('sendOrderEmail', order_id);
            }
          }).run();
        });

        Meteor.clearInterval(user_id_interval);
      } else console.log("HAVEN't GOT THE USER_ID YET",Orders.findOne(order_id).user_id);
    },200);
  },
  update_stripe_plan: function(order_id) {
    var plan_id = MasterConfig.stripe_plans.monthly,
        order = Orders.findOne(order_id),
        self = this,
        user = Meteor.users.findOne({_id: this.userId}),
        fut = new Future();

    if (!order) {
      throw new Meteor.Error('Order is null');
    }

    var process_stripe_res = function(err, subscription) {
      if (err) {
        console.log("Plan in stripe.js: update_plan: else:", err);
        // fut.throw(new Meteor.Error(err.name+': '+err.message));
        fut.throw(new Meteor.Error(err.name+': '+err.message));
      } else {
        Fiber(function() {
          // console.log("SUBSCRIPTION", subscription);
          Orders.update(order_id, {$set: {
            plan: plan_id,
            current_plan_start: subscription.current_period_start,
            current_plan_end: subscription.current_period_end,
            stripe_subscription_id: subscription.id
          }});
          fut.return(order._id);
        }).run();
      }
    };

    //if user has a subscription
    if (order.stripe_subscription_id) {
      Stripe.customers.updateSubscription(
        user.stripe_customer_token,
        user.stripe_subscription_id,
        {plan: plan_id},
        process_stripe_res);
    } else {
      Stripe.customers.createSubscription(
        user.stripe_customer_token, {
          plan: plan_id
        }, process_stripe_res);
    }
    return fut.wait();
  },
  cancel_stripe_subscription: function() {
    var user = Meteor.users.findOne({_id: this.userId});
    Stripe.customers.cancelSubscription(
      user.stripe_customer_token,
      user.stripe_subscription_id,
      function(err, confirmation) {
        if (err) {
          console.log("Error in cancelSubscription:", err);
          throw new Meteor.Error(err.name+': '+err.message);
        }
        Fiber(function() {
          console.log("Confirming Subscription Cancel:", confirmation);
          Meteor.users.update(user._id, {$set: {
            stripe_subscription_id: null
          }});
        }).run();
      }
    );
  }

});
