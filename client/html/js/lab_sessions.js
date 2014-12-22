Template.lab_sessions.helpers({
  'orders': function() {
    return Orders.find({user_id: Meteor.userId()});
  }
});
