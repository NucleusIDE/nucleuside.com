OrderCharge.extend({
	schema: {
		user_id: {
			type: String,		
		},
		units_used: {
			type: Number,		
		},
		last_charged: {
			type: Date,		
		}
	}
});