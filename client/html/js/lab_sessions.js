Template.lab_sessions.helpers({
	statusClass: function() {
		switch(this.ec2.status) {
			case 'running': 			return 'success';
			case 'pending': 			return 'warning';
			case 'stopping': 			return 'warning';
			case 'stopped': 			return 'danger';
			case 'shutting-down': return 'danger';
			case 'terminated': 		return 'danger';
			default: 							return 'primary';
		}
	},
  action_button_text: function() {
    if(this.is_monthly()) return order.is_running() ? 'reboot' : false;
    return order.is_running() ? 'stop' : 'start';
  },
  action_button_class: function() {
    if(this.is_monthly()) return order.is_running() ? 'primary reboot_instance' : false;
		return order.is_running() ? 'danger stop_instance' : 'success start_instance';
  }
});

Template.lab_sessions.events({
  'click .instance-action': function(e) {
    $(e.currentTarget).html('<i class="fa fa-spinner fa-spin"></i>');
  },
  'click .reboot_instance-action': function(e) {
		this.github_url = prompt('Feel free to change your Github URL.', this.github_url);
		this.save();
    this.reboot();
  },
  'click .start_instance': function(e) {
    this.start();
  },
  'click .stop_instance': function(e) {
    this.stop();
  },
	
	'click .remove_instance': function(e) {
		this.update({hide: true});
	},
	'click .cancel_subscription': function(e) {
		this.cancelSubscription();
	}
});
