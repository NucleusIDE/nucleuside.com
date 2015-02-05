Template.wiz.helpers({
  steps: function() {
    return [{
      path: 'billing-option',
			form: 'billing_option',
      title: '1. Billing Option',
      template: 'billing_option',
			barPercent: 20
    },{
      path: 'instance-details',
			form: 'order_details',
      title: '2. Order Details',
      template: 'order_details',
			barPercent: 40,
			onSubmit: function(model, wizard) {
				var isValid = model.isValidOrder();
				console.log('MODEL', model, isValid);
				
				return isValid;
			}
    }, {
      path: 'review',
			form: 'review',
      title: '3. Review',
      template: 'review',
			barPercent: 66,
      onSubmit: function(model, wizard) { 
				model.createOrder();
				return true;
      }	
    }, {
      path: 'complete',
      title: '4. Thank You!',
      template: 'thank_you',
			barPercent: 100
    }]
  }
});

Template.steps.helpers({
  stepClass: function(id) {
    var activeStep = this.wizard.activeStep(),
			step  = this.wizard.getStep(id);
		
    if(activeStep && activeStep.id === step.id) return 'active ';
    if(step.completed) return 'completed ';
    return 'disabled ';
  }
});

Template.instance_wizard_back_next.helpers({
  showPrevious: function() {
		var path = Template.parentData(1).wizard.activeStep().path;
    return path != 'billing-option' && path != 'complete';
  },
});

wiz = null;
Template.instance_wizard_back_next.events({
  "click .previous > button": function(e) {
    this.wizard.previous();
  },
});

Template.billing_option.events({
  "click .hourlyButton": function(e) {
		this.wizard.setData({billing_method: 'hourly'});
  },
  "click .monthlyButton": function(e) {
		this.wizard.setData({billing_method: 'monthly'});
  }
});

Template.billing_option.helpers({
	selected: function(cycle) {
		var billingMethod = this.wizard.model.billing_method;
		
		if(cycle == 'hourly') return billingMethod == 'hourly' ? 'btn-primary' : 'btn-transparent';
		else if(cycle == 'monthly') return billingMethod == 'monthly' ? 'btn-primary' : 'btn-transparent';
	}
});



Template.wiz.events({
	"blur #subdomain": function() {
		var order = Template.currentData();
		order.subdomain = $("#subdomain").val().trim();
		order.setSubdomainUsage();
	}
});

