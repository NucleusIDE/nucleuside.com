Ultimate('InstancesTable').extends(UltimateDatatableComponent, {
  	cssClasses: 'table table-striped table-hover',

  	lengthChange: false,
  	autoWidth: false,

  	order: [[ 2, 'desc' ]],
    extraFields: ['trial_started', 'terminated_at', 'billing_method', 'ec2'],

    sub: Instance.handle().subscribe('all'),

  	tableColumns: [
    	{title: "Subdomain", data: "subdomain", tmpl: 'InstanceDomainCell'},
    	{title: "Github URL", data: "github_url", render: function(val, type, model) {
        return '<a href="http://'+model.getGithubUrl()+'">'+model.getGithubUrl()+'</a>';
      }},
      {title: 'Launched', data: 'created_at', render: function(val, type, model) { return model.formattedDatetime(); }},
      {title: 'Running', data: 'created_at', render: function(val, type, model) { 
        return model.order().orderIs('trial') ? model.order().countdownToTermination(this) : model.hoursRunning(); 
      }},
      {title: 'Cost', data: 'last_charged', render: function(val, type, model) {
        return model.order().runningCostFormatted();
      }},
    	{title: "Status", data: 'ec2.status', tmpl: 'InstanceStatusCell'},
    	{tmpl: 'InstanceButtonCellWrapper'}
  	]
});