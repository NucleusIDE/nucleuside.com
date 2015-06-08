Ultimate('InstanceStatusCell').extends(UltimateComponent, {
  statusClass: ['model.getStatus', {stopped: 'danger', terminated: 'danger', running: 'success', default: 'warning'}],
});

Ultimate('InstanceDomainCell').extends(UltimateComponent, {
  'click .remove_instance': ['model', 'update', {hide: true}],
  'click .cancel_subscription': ['model', 'cancelSubscription']
});



Ultimate('InstanceButtonCellWrapper').extends(UltimateComponent, {
  cellTemplate: function() {
    var billingMethod = this.model().billing_method;
    console.log('BM', this.model(), this.model().billing_method, this.model().order());
    return Template[billingMethod + '_button_cell'];
  }
});




Ultimate('InstanceButtonCell').extends(UltimateComponent, {
  showActionButton: ['model.getStatus', ['running', 'terminated']],
  actionButtonText: ['model.isRunning', 'stop', 'start'],
  actionButtonClass: ['model.isRunning', 'danger', 'success'],
  
  dontShowTerminatedButton: function() {
    return this.model().getStatus() == 'terminated' && !Meteor.user().isAdmin();
  },

  'click .btn-success': ['model', 'startup'],
  'click .btn-danger': ['model', 'shutdown']
});


Ultimate('trial_button_cell').extends(InstanceButtonCell);
Ultimate('hourly_button_cell').extends(InstanceButtonCell);
Ultimate('monthly_button_cell').extends(InstanceButtonCell, {
  actionButtonText: ['model.isRunning', 'reboot', 'start'],
  actionButtonClass: ['model.isRunning', 'primary', 'success'],
  

  'click .btn-primary': function(e) {
    this.model().github_url = prompt('Feel free to change your Github URL.', this.model().github_url);
    this.model().save();
    this.model().reboot();
  },
});

