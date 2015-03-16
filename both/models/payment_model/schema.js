Ultimate('Payment').extends(UltimateModel, 'payments', {
  schema: {
		user_id: {
			type: String	
		},
		order_id: {
			type: String		
		},
		
		
		units_used: {
			type: Number	
		},
		cost_per_unit: {
			type: Number	
		},
		github_url: {
			type: String	
		},
		subdomain: {
			type: String	
		},
		billing_method: {
			type: String	
		},
		
		
		status: {
			type: String	
		},
		amount: {
			type: Number	
		},
		num: {
			type: Number	
		},
		date: {
			type: Date,		
		},
		
		
		stripe_subscription_id: {
			type: String,		
			optional: true
		},
		stripe_charge_id: {
			type: String,		
			optional: true
		},
		next_attempt: {
			type: String,		
			optional: true
		}
  }
});

Payments.before.insert(function (userId, doc) {
  doc.date = moment().toDate();
	doc.num = Payments.find().count() + 1;
});