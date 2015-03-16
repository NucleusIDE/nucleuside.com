CreditCard.extend({
	forms: {
		'payment_details': {
			keys: ['number', 'expMonth', 'expYear', 'cvc'],
			onSubmit: function() {
				this.user_id = Meteor.userId();
				this.addNewCard(this.stripeCard());
				
				if(Session.get('redirect_to_new_instance_wizard_step_3')) {
					Session.set('redirect_to_new_instance_wizard_step_3', null);
					Router.go('new_instance', {step: 'review'});
				}
			}
		}
	}
});