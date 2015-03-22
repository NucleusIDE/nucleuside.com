Ultimate('monthly_row').extends(InstanceRow, {
	showActionButton: ['model.isRunning'],
  actionButtonText: ['model.isRunning', 'reboot', ''],
  actionButtonClass: ['model.isRunning', 'primary', ''],
	
  'click .btn-primary': function(e) {
		this.model().github_url = prompt('Feel free to change your Github URL.', this.model().github_url);
		this.model().save();
    this.model().reboot();
  },
	'click .cancel_subscription': ['model.order', 'cancelSubscription']
});

