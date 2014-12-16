Stripe = StripeAPI(MasterConfig.keys.stripe);

Fiber = Npm.require("fibers");

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
  chargeCustomer: function(orderId) {
    var order = Orders.findOne(orderId),
        // customer = Meteor.users.findOne(order.customer_id),
        customerId = order.customer_id,
        error, result;

    console.log("********************************");
    console.log("INSIDE chargeCustomer");
    console.log("********************************");
    console.log("ORDER IS", order._id);
    console.log("CUSTOMER IS", order.customer_id);
    console.log("********************************");

    var customer_id_interval = Meteor.setInterval(function() {
      if (Orders.findOne(orderId).customer_id) {

        Stripe.charges.create({
          amount: order.cost*100,
          currency: "USD",
          customer: Meteor.users.findOne(customerId).stripe_customer_token
        }, function (error, result) {
          Fiber(function() {
            if(error != undefined) {
              console.log("ERROR WHILE CHARGING USER: ", error);
              console.log("AMOUNT WAS:", order.cost*100);
              Meteor.users.update(customerId, {$set: {valid_card: false}});
              Orders.update(orderId, {$set: {error: error, order_processed: true}});
            }
            //we'll use the stripe_charge_id to refund it if the deadline is missed. no more captures
            else {
              Orders.update(orderId, {$set: {paid: true, stripe_charge_id: result.id, order_processed: true, status: OrderStatuses.NEW}});
              order.celebrity().decrementAvailableInventory();
              Meteor.call('sendOrderEmail', orderId);
            }
          }).run();
        });

        Meteor.clearInterval(customer_id_interval);
      } else console.log("HAVEN't GOT THE CUSTOMER_ID YET",Orders.findOne(orderId).customer_id);
    },200);
  }
});
