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
      var label = data.status === 'Active' ? 'success' : 'danger';
      Session.set(self._id+'_instance_status', {status: data.status, class: label});
    });

    return Session.get(this._id+'_instance_status');
  },
  action_button: function() {
    var order = Orders.findOne(this._id);
    if (order.is_monthly()) {
      return false;
    }
    return order.is_running() ? {
      text: 'Stop',
      class: 'danger'
    } : {
      text: 'Start',
      class: 'success'
    };
  }
});

Template.lab_sessions.events({
  "click .instance-action": function(e) {
    e.preventDefault();
    var order = Orders.findOne(this._id);

    $(e.currentTarget).html('<i class="fa fa-spinner fa-spin"></i>');

    if (order.is_running()) {
      Meteor.call('stop_aws_instance', this._id, function(err, data) {
        if (err) console.log("ERROR WHILE STOPPING INSTANCE", err); return;
        console.log("DATA FROM SERVER", data);

      });
    } else {
      Meteor.call('start_aws_instance', this._id, function(err, data) {
        if (err) console.log("ERROR WHILE STARTING INSTANCE", err); return;
        console.log("DATA FROM SERVER", data);
      });
    }

  }
});
