StripeCharge.extendStatic({
	onStartup: function() {
		this.setTimeout(this.chargeOrder, 10 * 60 * 1000); //charge some orders on every startup
		this.setInterval(this.chargeOrder, 24 * 60 * 60 * 1000);

		this.setInterval(this.killOldTrials, 10 * 60 * 1000);
	},
	chargeOrder: function() {
		console.log("STARTING UP WEEKLY ORDER CHARGING");
		
		var orders = this.ordersToCharge();
	
		orders.forEach(function(order) {
			if(order.user().isAdmin()) return;
			
			var stripeCharge = new StripeCharge(order);
			stripeCharge.charge();
		});
	},
	ordersToCharge: function() { //after all we'll only collect orders that are old enough to be charged
		return Orders.find({billing_method: 'hourly', last_charged: {$lt: moment().subtract(24, 'hours').toDate()}});
	},
	
	
	killOldTrials: function() {
		var orders = Orders.find({trial_started: {$lt: moment().subtract(10, 'minutes').toDate()}});
		orders.forEach(function(order) {
			order.instance().terminate();
		});
	}
});