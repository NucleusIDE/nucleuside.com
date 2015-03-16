Ultimate('CreditCard').extends(UltimateForm, {
	stripeCard: function() {
		return _.pick(this, 'number', 'expMonth', 'expYear', 'cvc');
	},
	last4: function() {
		return (this.number+'').slice(-4);
	},
	addNewCard: function(stripeCard) {
    BlockUI.block();
    this.stripeCreateToken(stripeCard);
	},
	stripeCreateToken: function(stripeCard) {
		Stripe.createToken(stripeCard, this.stripeCallback.bind(this));
	},
	stripeCallback: function(status, response) {
    if(status === 200) this.stripeSuccess();
		else this.stripeFail();
  },
	stripeSuccess: function() {
		this.updateBillingInfo(response.id, function(error, result) {
      if (error) Flash.danger('Something is wrong with the card you provided. Please double check it.');
      else {
      	Flash.success("Payment info updated! :)");
				if($("#payment-details-form").length > 0) $("#payment-details-form").reset();  
      }  
    });
	},
	stripeFail: function() {
		Flash.danger('Something is wrong with the card you provided. Please double check it.');
	}
});


CreditCard.extendHTTP({
  updateBillingInfo: function(cardToken) {
		var stripeCustomer = new StripeCustomer(this.user_id, cardToken, this.last4());
		stripeCustomer.generateCustomer();
  }
});