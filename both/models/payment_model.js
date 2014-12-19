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
 *
 **/

Payments = new Meteor.Collection('payments');
PaymentModel = Model(Payments);

PaymentModel.extend({
  user: function() {
    return Meteor.users.findOne(this.user_id);
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
  get_date: function () {
    return moment(this.date).format('ddd MMMM DD YYYY');
  },
  handle_failed_payment: function () {
    var user = this.user(),
        order = this.get_order();
    user.update({valid_card: false});
    order.deactivate();
  }
});
