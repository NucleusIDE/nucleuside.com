Template.billing_history.helpers({
  payments: function() {
    var user = Meteor.user();
    return Payments.find({user_id: user._id});
  }
});
