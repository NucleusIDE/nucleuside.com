/**
 * Attributes
 *
 * _has_valid_card             Boolean
 */

User = function User() {};

User.modelExtends(Meteor.users, {
  has_valid_card: function() {
    return !! this.valid_card;
  },
  get_email: function() {
    return this.emails[0].address;
  },
  get_card: function() {
    return this.card_number;
  },
  is_admin: function() {
    return Roles.userIsInRole(this._id, ['admin']);
  },
	hasNoInstances: function() {
		return Orders.find().count() === 0;
	},
	add_new_card: function(stripe_card, last4) {
    BlockUI.block();
		
    Stripe.createToken(stripe_card, function(status, response) {
      if(status === 200) {
				
				this.update_billing_info(response.id, last4, function(error, result) {
          if (error) Flash.danger('Something is wrong with the card you provided. Please double check it.');
          else Flash.success("Payment info updated! :)") && $("#payment-details-form").reset();    
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

