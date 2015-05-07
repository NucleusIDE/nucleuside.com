Ultimate('InstanceRow').extends(UltimateComponent, {
  statusClass: ['model.status', {stopped: 'danger', terminated: 'danger', running: 'success', default: 'warning'}],
  showActionButton: ['model.status', ['running', 'terminated']],
  actionButtonText: ['model.isRunning', 'stop', 'start'],
  actionButtonClass: ['model.isRunning', 'danger', 'success'],
  
  'click .btn-success': ['model', 'run'],
  'click .btn-danger': ['model', 'terminate'],
  'click .remove_instance': ['model', 'update', {hide: true}],
  
  'click .btn': function(e) {
    $(e.currentTarget).html('<i class="fa fa-spinner fa-spin"></i>');
  },
  'click': function() {
    debugger; 
    console.log(123);
  }
});

