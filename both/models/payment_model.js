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
 * units_used                     Integer
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
    return this.units_used;
  },
  handle_failed_payment: function () {
    var user = this.user(),
        order = this.get_order();
    user.update({valid_card: false});
    order.deactivate();
  }
});
