User = function User() {};

User.modelExtends(Meteor.users, {
	schema: function() {
		return {
			stripe_customer_token: {
				type: String,		
			},
			valid_card: {
				type: Boolean,		
			},
			name_on_card: {
				type: String,		
				label: 'Name on Card'
			},
			card_number: {
				type: Number,	
				label: 'Card Number',
				custom: function(simpleSchema) {
					if(!_.isNumber(parseInt(this.card_number))) return 'Your card number should be a number';
					if((this.card_number+'').replace(/ /g, '').length !== 16) return 'Your card number must be 16 digits';
				}	
			},
			expiration_month: {
				type: Number,	
				allowedValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
		    autoform: {
					type: "select",
					options: {
						1: 'January',
						2: 'February',
						3: 'March',
						4: 'April',
						5: 'May',
						6: 'June',
						7: 'July',
						8: 'August',
						9: 'September',
						10: 'October',
						11: 'November',
						12: 'December'
					}
		    }	
			},
			expiration_year: {
				type: Number,		
				allowedValues: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032],	
			},
			cvc: {
				type: Number,		
				label: 'CVC',
				custom: function(simpleSchema) {
					if(!_.isNumber(parseInt(this.cvc))) return 'Your card number should be a number';
					if((this.cvc+'').replace(/ /g, '').length !== 3) return 'Your CVC must be 3 digits';
				}	
			}	
		};
	},
	forms: function() {
		return {
			'payment_details': {
				keys: ['name_on_card', 'card_number', 'expiration_month', 'expiration_year', 'cvc'],
				onSubmit: function() {
			    var card = {
			      expMonth: this.expiration_month,
			      expYear: this.expiration_year,
			      number: this.card_number,
			      cvc: this.cvc
			    };
					
					var last4 = (this.card_number+'').slice(-4);
					
					delete this.expiration_month;
					delete this.expiration_year;
					delete this.card_number;
					delete this.cvc;
					
					this.addNewCard(card, last4);
				}
			}
		};
	},
  hasValidCard: function() {
    return !!this.valid_card;
  },
  getEmail: function() {
    return this.emails[0].address;
  },
  isAdmin: function() {
    return Roles.userIsInRole(this._id, ['admin']);
  },
	hasNoInstances: function() {
		return Orders.find().count() === 0;
	},
	addNewCard: function(stripe_card, last4) {
    BlockUI.block();
		
    Stripe.createToken(stripe_card, function(status, response) {
      if(status === 200) {
				
				this.update_billing_info(response.id, last4, function(error, result) {
          if (error) Flash.danger('Something is wrong with the card you provided. Please double check it.');
          else Flash.success("Payment info updated! :)") || $("#payment-details-form").reset();    
        });
				
      } else Flash.danger('Something is wrong with the card you provided. Please double check it.');
    }.bind(this));
	}
});


User.extendHTTP({
  update_billing_info: function(card_token, last_4) {
		var stripeCustomer = new StripeCustomer(this, card_token, last_4);
		stripeCustomer.generateCustomer();
  }
});

