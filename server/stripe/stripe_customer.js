Ultimate('StripeCustomer').extends(Stripe, {
	construct: function(userId, card_token, last_4) {
		this.user = Meteor.users.findOne(userId);
		this.email = this.user.getEmail();
		this.card_token = card_token;
		this.last_4 = last_4;
	},
	generateCustomer: function() {
		if(!this.user.stripe_customer_token) this.createCustomer();
		else this.updateCustomer();
	},
	createCustomer: function() {
		var res = this._createSync({card: this.card_token, email: this.email});
		
    if(res.error) throw new Meteor.Error(res.error.name, res.error.message);
		else this.addCardToUser(res.data.id); 
	},
	updateCustomer: function() {
		var res = this._updateSync(this.user.stripe_customer_token, {card: this.card_token});
		
    if(res.error) throw new Meteor.Error(res.error.name, res.error.message);
		else this.addCardToUser(); 
	},
	
	addCardToUser: function(customer_token) {
		this.user.valid_card = true;
		this.user.card_number = this.last_4;
		
		if(customer_token) this.user.stripe_customer_token = customer_token;
		
		this.user.save();	
		console.log('VALID CARD BITCHES!');
	},
	
	_createSync: function() {
		return this.applySync(this._stripe(), 'create', _.toArray(arguments));
	},
	_updateSync: function() {
		return this.applySync(this._stripe(), 'update', _.toArray(arguments));
	},
	_stripe: function() {
		return this._getStripe().customers;
	}
});