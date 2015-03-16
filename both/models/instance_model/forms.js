Order.extend({
	forms: function() {
		return {
			'billing_option': {
				keys: ['billing_method']
			},
			'order_details': {
				keys: ['github_url', 'subdomain', 'password']
				
				/**
				onSubmit: function(autoform, wizard) {
					console.log('EXAMPLE ONSUBMIT FROM FORM DEFINITION');
					autoform.done();
				}
				**/
			}
		};
	},
	wizards: function() {
		return {
			'create_instance': [
				{
		      path: 'billing-option',
		      title: '1. Billing Option',
		      template: 'billing_option',
					barPercent: 20,
					onBeforeShow: function(wizard) {
						var githubUrl = Session.get('free_trial_github_url')
						
						if(githubUrl) {
							Session.set('free_trial_github_url', null);
							
							this.billing_method = 'trial';
							this.github_url = githubUrl;
							this.save();

							wizard.next();
						}
					}
		    },{
		      path: 'instance-details',
					form: 'order_details',
		      title: '2. Order Details',
		      template: 'order_details',
					barPercent: 45,
					onNext: function(wizard, autoform) {
						if(Meteor.user().valid_card) {
							wizard.setStepsCompleted(2);
							Session.set('redirect_to_new_instance_wizard_step_3', true);
							Router.go('payment_details');
						}
						else wizard.next();
					}
		    }, {
		      path: 'review',
		      title: '3. Review',
		      template: 'review',
					barPercent: 63,
		      onNext: function(wizard) { 
						this.createOrder();
						wizard.next();
		      }	
		    }, {
		      path: 'complete',
		      title: '4. Thank You!',
		      template: 'thank_you',
					barPercent: 100
		    }
			],
			'another_wizard': {}
		};
	}
});