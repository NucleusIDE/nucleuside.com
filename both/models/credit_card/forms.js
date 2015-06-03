CreditCard.extend({
	forms: {
		'payment_info': {
			keys: ['number', 'expMonth', 'expYear', 'cvc'],
			onSubmit: function(autoform) {
				this.user_id = Meteor.userId();
				this.addNewCard(this.stripeCard());
				
				autoform.done();

				if(Session.get('redirect_to_new_instance_wizard_step_3')) {
					Session.set('redirect_to_new_instance_wizard_step_3', null);
					Router.go('new_instance', {step: 'review'});
				}
			}
		}
	}
});