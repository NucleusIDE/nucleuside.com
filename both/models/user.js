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
	},


	subscriptions: {
		recentUsers: {
			selector: {valid_card: true},
			limit: 2,
			//with: ['instances']
		}
	},
	relations: {
		instances: {
			relation: 'has_many',
			model: Instance,
			foreign_key: 'user_id',
			//with: ['payments']
			//aggregates: ['totalCost'],
		},
		
		
		manyPayments: {
			relation: 'many_to_many',
			model: Payment,
			through: Instance,
			foreign_key: ['user_id', 'payment_id'],
			options: {
				sort: {updated_at: -1}
			},
			throughOptions: {
				sort: {updated_at: 1}
			}
			//aggregates: ['totalCost'],
		}
		
	}
});