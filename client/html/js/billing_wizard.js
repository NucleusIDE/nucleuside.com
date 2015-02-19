Template.billing_option.events({
  "click .hourlyButton": function(e) {
		this.model.set('billing_method', 'hourly');
  },
  "click .monthlyButton": function(e) {
		this.model.set('billing_method', 'monthly');
  }
});

Template.billing_option.helpers({
	selected: function(cycle) {
		var billingMethod = this.model.billing_method;
		
		if(cycle == 'hourly') return billingMethod == 'hourly' ? 'btn-primary' : 'btn-transparent';
		else if(cycle == 'monthly') return billingMethod == 'monthly' ? 'btn-primary' : 'btn-transparent';
	}
});