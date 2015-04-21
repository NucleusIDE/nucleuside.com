HourlyOrder.extend({
	schema: {
		instance_id: {
			type: String,		
		},
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