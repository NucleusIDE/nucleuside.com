/** PaymentModel attributes:
 *
 * _id                            MongoId
 * user_id                        MongoId
 * status                         String (SUCCESS || FAIL)
 * amount                         Integer
 * date                           Date
 * order_id                       Mongo ID
 * order_billing_method           String
 * next_attempt                   Unix Timestamp - set by stripe
 * stripe_subscription_id         Stripe Subscription ID
 * order_units_used                     Integer
 * order_cost_per_unit            MongoId

 **/

Payments = new Meteor.Collection('payments');
PaymentModel = Model(Payments);

Payments.before.insert(function (userId, doc) {
  doc.num = Payments.find().count() + 1;
});

PaymentModel.extend({
  user: function() {
    return Meteor.users.findOne(this.user_id);
  },
  get_cost_per_unit: function() {
    return this.order_cost_per_unit || 1;
  },
  get_order: function() {
    return Orders.findOne(this.order_id);
  },
  is_successfull: function () {
    return this.status === 'SUCCESS';
  },
  get_status: function () {
    return this.is_successfull ? "Success" : "Failed";
  },
  get_amount: function () {
    return this.amount || 0;
  },
  get_dollar_amount: function () {
    return "$ "+this.getAmount();
  },
  get_invoice_number: function() {
    return this.num || 1;
  },
  get_date: function () {
    return moment(this.date).format('ddd MMMM DD YYYY');
  },
  get_units_used: function() {
    return this.order_units_used || 1;
  },
  get_subdomain: function() {
    return this.order_subdomain || 'subdomain';
  },
  get_github_url: function() {
    return this.github_url || 'github-url';
  },
  handle_failed_payment: function () {
    var user = this.user(),
        order = this.get_order();
    user.update({valid_card: false});
    order.deactivate();
  },

  create_payment: function(payment_type, order_id) {
    var order = Orders.findOne(order_id),
        payment = new PaymentModel();

    payment.order_id = order._id;
    payment.user_id = order.user_id;
    payment.order_billing_method = order.billing_method;
    payment.amount = order.get_cost_to_charge();
    payment.date = moment().toDate();
    payment.order_units_used = order.get_units_used();
    payment.order_cost_per_unit = order.get_cost_per_unit();
    payment.order_github_url = order.get_github_url();
    payment.order_subdomain = order.get_subdomain();

    if (payment_type.toLowerCase() === 'fail') {
      payment.status = 'FAIL';
      payment.handle_failed_payment();

      Meteor.call("send_payment_failed_email", order._id);
    } else {
      payment.status = 'SUCCESS';
      payment.stripe_charge_id = res.id;
      payment.units_used = order.get_units_used();

      Meteor.call("send_invoice_email", order._id);

      order.reset();
    }

    payment.save();

    return payment;
  }
});
