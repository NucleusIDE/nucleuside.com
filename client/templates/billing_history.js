Ultimate('billing_history').extends(UltimateComponent, {
  payments: function() {
    var user = Meteor.user();
    return Payments.find({user_id: user._id});
  },
  'click tr.clickable': function() {
    Router.go("invoice", {payment_id: this._id});
  }
});
