Ultimate('InstancesGrid').extends(UltimateComponent, {
  	template: 'instances',
	rowTemplate: function() {
		var billingMethod = this.model().billing_method;
		return Template[billingMethod + '_row'];
	}
});

