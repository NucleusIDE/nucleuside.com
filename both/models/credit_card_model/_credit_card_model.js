Ultimate('CreditCard').extends(UltimateForm, {
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