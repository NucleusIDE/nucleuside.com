Ultimate('monthly_row').extends(InstanceRow, {
	showActionButton: function() {
		return this.model().isRunning();
	},
  actionButtonText: function() {
    return this.model().isRunning() ? 'reboot' : '';
  },
  actionButtonClass: function() {
    return this.model().isRunning() ? 'primary' : '';
  },
	
	
  'click .btn-primary': function(e) {
		this.model().github_url = prompt('Feel free to change your Github URL.', this.model().github_url);
		this.model().save();
    this.model().reboot();
  },
	'click .cancel_subscription': ['model.order', 'cancelSubscription']
});

