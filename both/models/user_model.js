Ultimate('User').extends(UltimateModel, Meteor.users, {
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
  getEmail: function() {
    return this.emails[0].address;
  },
  isAdmin: function() {
    return Roles.userIsInRole(this._id, ['admin']);
  },
	hasNoInstances: function() {
		return Orders.find().count() === 0;
	}
});