Template.lab_sessions.helpers({
  'orders': function() {
    var orders = Orders.find({user_id: Meteor.userId()});
    orders.forEach(function(order) {
      Session.setDefault(order._id+'_instance_status', {status: 'Checking...', class: 'info'});
    });
    return orders;
  },
  status: function() {
    var self = this;

    this.check_instance_status(function(err, data) {
      if (err) {
        console.log("ERROR WHILE CHECKING STATUS", err.message);
        data = {};
        data.status = "Couldn't verify";
      }
      var label = data.status === 'Stopped' ? 'danger' : 'success';
      Session.set(self._id+'_instance_status', {status: data.status, class: label});
    });

    return Session.get(this._id+'_instance_status');
  }
});
