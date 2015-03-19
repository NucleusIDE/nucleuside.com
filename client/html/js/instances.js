Ultimate('instances').extends(UltimateComponent, {
	rowTemplate: function() {
		var billingMethod = this.order().billing_method;
		return Template[billingMethod + '_row'];
	}
});

