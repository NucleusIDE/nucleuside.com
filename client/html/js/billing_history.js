Template.billing_history.helpers({
  payments: function() {
    var user = Meteor.user();
    return Payments.find({user_id: user._id});
  }
});

Template.billing_history.events({
  "click tr.clickable": function() {
    Router.go("invoice", {payment_id: this._id});
  }
});
