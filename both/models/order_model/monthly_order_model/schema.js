OrderSubscription.extend({
	schema: {
		user_id: {
			type: String,		
		},
		units_used: {
			type: Number,		
		},
		current_plan_start: {
			type: Number,		//we should converte these to/from Date objects
		},
		current_plan_end: {
			type: Number,		
		}
	}
});