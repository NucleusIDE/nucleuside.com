Ultimate('InstanceRow').extends(UltimateComponent, {
	statusClass: function() {
		switch(this.model().ec2().status) {
			case 'stopped': 			return 'danger';
			case 'terminated': 		return 'danger';
			case 'running': 			return 'success';
			default: 							return 'warning'; //pending, stopping, shutting-down
		}
	},
	status: function() {
		return this.model().ec2().status;
	},
	
	
	showActionButton: function() {
		var status = this.model().ec2().status;
		return /running|terminated/.test(status);
	},
  actionButtonText: ['model.isRunning', 'stop', 'start'],
  actionButtonClass: ['model.isRunning', 'danger', 'success'],

	
  'click .btn-success': ['model', 'run'],
  'click .btn-danger': ['model', 'terminate'],
	'click .remove_instance': ['model', 'update', {hide: true}],
	
  'click .btn': function(e) {
    $(e.currentTarget).html('<i class="fa fa-spinner fa-spin"></i>');
  }
});

