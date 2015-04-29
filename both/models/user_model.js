Ultimate('User').extends(UltimateUser, {
	schema: {
		stripe_customer_token: {
			type: String
		},
		valid_card: {
			type: Boolean,
		}
	},
  hasValidCard: function() {
    return !!this.valid_card;
  },
	hasNoInstances: function() {
		return Orders.find().count() === 0;
	}
});