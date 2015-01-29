Template.lab_sessions.helpers({
  'orders': function() {
    return Orders.find();
  },
  status: function() {
    return this.ec2.status;
  },
	statusClass: function() {
		if(this.ec2.status === 'running') return 'success';
		if(this.ec2.status === 'pending') return 'warning';
		if(this.ec2.status === 'stopping') return 'warning';
		if(this.ec2.status === 'stopped') return 'danger';
		if(this.ec2.status === 'shutting-down') return 'danger';
		if(this.ec2.status === 'terminated') return 'danger';
	},
  action_button_text: function() {
    if(this.is_monthly()) return false;
    return order.is_running() ? 'stop' : 'start';
  },
  action_button_class: function() {
    if(this.is_monthly()) return false;
		return order.is_running() ? 'danger' : 'success';
  }
});

Template.lab_sessions.events({
  "click .instance-action": function(e) {
    e.preventDefault();
    $(e.currentTarget).html('<i class="fa fa-spinner fa-spin"></i>');
		
    if (this.is_running()) this.stop();
		else this.start();
  }
});
