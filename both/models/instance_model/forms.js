Order.extend({
	forms: {
		'order_details': {
			keys: ['github_url', 'subdomain', 'password']
		}
	},
	wizards: function() {
		return {
			'create_instance': [
				{
		      path: 'billing-option',
		      title: 'Billing Option',
		      template: 'billing_option',
					barPercent: 20,
					onBeforeShow: function(wizard) {
						var githubUrl = Session.get('free_trial_github_url');
						
						if(githubUrl) {
							Session.set('free_trial_github_url', null);
							
							this.billing_method = 'trial';
							this.github_url = githubUrl;
							this.save();

							wizard.next();
						}
					}
		    }, {
		      path: 'instance-details',
					form: 'order_details',
		      title: 'Order Details',
		      template: 'order_details',
					barPercent: 45,
					onNext: function(wizard, autoform) {
						if(!Meteor.user().valid_card) {
							wizard.setStepsCompleted(2);
							Session.set('redirect_to_new_instance_wizard_step_3', true);
							Router.go('payment_details');
						}
						else wizard.next();
					}
		    }, {
		      path: 'review',
		      title: 'Review',
		      template: 'review',
					barPercent: 63,
		      onNext: function(wizard) { 
						this.createInstance();
						wizard.next();
		      }	
		    }, {
		      path: 'complete',
		      title: 'Thank You!',
		      template: 'thank_you',
					barPercent: 100
		    }
			]
		};
	}
});