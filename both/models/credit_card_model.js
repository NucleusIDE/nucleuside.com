Ultimate('CreditCard').extends(UltimateForm, {
	schema: {
		number: {
			type: Number,	
			label: 'Card Number',
			custom: function() {
				if((this.number.toString()).replace(/ /g, '').length !== 16) return 'Your card number must be 16 digits';
			}	
		},
		expMonth: {
			type: Number,	
			allowedValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
	    autoform: {
				type: "select",
				options: {
					1: 'January', 2: 'February', 3: 'March', 4: 'April', 5: 'May', 6: 'June',
					7: 'July', 8: 'August', 9: 'September', 10: 'October', 11: 'November', 12: 'December'
				}
	    }	
		},
		expYear: {
			type: Number,		
			allowedValues: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032]	
		},
		cvc: {
			type: Number,		
			label: 'CVC',
			custom: function() {
				if((this.cvc.toString()).replace(/ /g, '').length !== 3) return 'Your CVC must be 3 digits';
			}	
		}	
	},
	forms: {
		'payment_details': {
			keys: ['number', 'expMonth', 'expYear', 'cvc'],
			onSubmit: function() {
				this.user_id = Meteor.userId();
				this.addNewCard(this.stripeCard(), this.last4());
				
				if(Session.get('redirect_to_new_instance_wizard_step_3')) {
					Session.set('redirect_to_new_instance_wizard_step_3', null);
					Router.go('new_instance', {step: 'review'});
				}
			}
		}
	},
	stripeCard: function() {
		return _.pick(this, 'number', 'expMonth', 'expYear', 'cvc');
	},
	last4: function() {
		return (this.number+'').slice(-4);
	},
	addNewCard: function(stripeCard, last4) {
    BlockUI.block();

    Stripe.createToken(stripeCard, function(status, response) {
      if(status === 200) {
				
				this.update_billing_info(response.id, last4, function(error, result) {
          if (error) Flash.danger('Something is wrong with the card you provided. Please double check it.');
          else {
          	Flash.success("Payment info updated! :)") 
						if($("#payment-details-form").length > 0) $("#payment-details-form").reset();  
          }  
        });
				
      } else Flash.danger('Something is wrong with the card you provided. Please double check it.');
    }.bind(this));
	}
});


CreditCard.extendHTTP({
  update_billing_info: function(cardToken, last4) {
		var stripeCustomer = new StripeCustomer(this.user_id, cardToken, last4);
		stripeCustomer.generateCustomer();
  }
});