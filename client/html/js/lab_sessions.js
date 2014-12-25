Template.lab_sessions.helpers({
  'orders': function() {
    var orders = Orders.find({user_id: Meteor.userId()});
    orders.forEach(function(order) {
      Session.setDefault(order._id+'_instance_status', 'Checking...');
    });
    return orders;
  },
  status: function() {
    var self = this;

    this.check_instance_status(function(err, data) {
      Session.set(self._id+'_instance_status', data.status);
    });

    return Session.get(this._id+'_instance_status');
  }
});
