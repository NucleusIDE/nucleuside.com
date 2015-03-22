Ultimate('User').extends(UltimateUser, Meteor.users, {
	schema: {
		stripe_customer_token: {
			type: String,		
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

User.extendServer({
	getGithubToken: function() {
		return this.services.github.accessToken;
	}
});