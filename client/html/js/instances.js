Ultimate('lab_sessions').extends(UltimateTemplate, {
	statusClass: function() {
		switch(this.ec2().status) {
			case 'running': 			return 'success';
			case 'pending': 			return 'warning';
			case 'stopping': 			return 'warning';
			case 'stopped': 			return 'danger';
			case 'shutting-down': return 'warning';
			case 'terminated': 		return 'danger';
			default: 							return 'primary';
		}
	},
	status: function() {
		if(this.model().trial_started && this.model().ec2().status == 'running') {
			this.setReactiveIntervalUntil(function() {
				return this.model().ec2().status != 'running';
			}, 1000);
			
			return Utilities.countdown(this.model().trial_start_time, 10);
		}
		else return this.model().ec2().status;
	},
	showActionButton: function() {
		if(this.model().isMonthly()) return this.model().isRunning() ? true : false;
		else return this.model().ec2().status == 'running' || this.model().ec2().status == 'terminated' ? true : false;
	},
  action_button_text: function() {
    if(this.model().isMonthly()) return this.model().isRunning() ? 'reboot' : false;
    return this.model().isRunning() ? 'stop' : 'start';
  },
  action_button_class: function() {
    if(this.model().isMonthly()) return this.model().isRunning() ? 'primary reboot_instance' : '';
		return this.model().isRunning() ? 'danger stop_instance' : 'success start_instance';
  },
	
	
  'click .instance-action': function(e) {
    $(e.currentTarget).html('<i class="fa fa-spinner fa-spin"></i>');
  },
  'click .reboot_instance': function(e) {
		this.model().github_url = prompt('Feel free to change your Github URL.', this.model().github_url);
		this.model().save();
    this.model().reboot();
  },
  'click .start_instance': function(e) {
    this.model().run();
  },
  'click .stop_instance': function(e) {
    this.model().terminate();
  },
	
	'click .remove_instance': function(e) {
		this.model().hideInstance();
	},
	'click .cancel_subscription': function(e) {
		this.model().cancelSubscription();
	}
});

