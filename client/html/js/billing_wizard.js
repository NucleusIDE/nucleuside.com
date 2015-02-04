Template.wiz.helpers({
  steps: function() {
    return [{
      id: 'billing-option',
      title: 'Billing Option',
      template: 'billing_option',
      formId: 'billing_option',
			num: 1,
			barPercent: function() {return this.num * 25;},
			schema: function() {
				return new SimpleSchema({
		  		billing_method: {
				    type: String,
						defaultValue: 'hourly'
				  }
				});
			},
			onSubmit: function(data, wizard) {
				console.log(wizard.model);
				wizard.next({});
			}
    },{
      id: 'instance-details',
      title: 'Order Details',
      template: 'order_details',
      formId: 'order_details',
			num: 2,
			barPercent: function() {return this.num * 25;},
			schema: function() {
				return new SimpleSchema({
		  		github_url: {
				    type: String,
				    label: "Github URL",
						autoform: {
							placeholder: 'Github URL of your Project'
						}
				  },
		  		subdomain: {
				    type: String,
				    label: "Subdomain",
						autoform: {
							placeholder: 'my-project'
						}
				  },
		  		password: {
				    type: String,
				    label: "Password",
						optional: true,
						autoform: {
							placeholder: '(optional)'
						}
				  }
				});
			},
			onSubmit: function(data, wizard) {
				_.extend(wizard.model, data);
				
				if(model.isValidOrder()) wizard.next({});
			}
    }, {
      id: 'review',
      title: 'Review',
      template: 'review',
      formId: 'review',
			num: 3,
			barPercent: function() {return this.num * 25;},
      onSubmit: function(data, wizard) {
				_.extend(wizard.model, data);  
				wizard.model.createOrder();
				this.done();
				wizard.next();
      }	
    }, {
      id: 'complete',
      title: 'Thank You!',
      template: 'thank_you',
      formId: 'thank_you',
			num: 4,
			barPercent: function() {return this.num * 25;}
    }]
  }
});

Template.steps.helpers({
  stepClass: function(id) {
    var activeStep = this.wizard.activeStep(),
			step  = this.wizard.getStep(id);
		
    if(activeStep && activeStep.id === step.id) return 'active ';
    if(step.data()) return 'completed ';
    return 'disabled ';
  }
});

Template.instance_wizard_back_next.helpers({
  showPrevious: function() {
    return this.wizard.activeStep().num != 1;
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
		this.wizard.model.billing_method = 'hourly';
  },
  "click .monthlyButton": function(e) {
		this.wizard.model.billing_method = 'monthly';
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

