Ultimate('TrialOrder').extends(Order, 'orders', {
	billing_method: 'trial',
	displayAmount: 'FREE',
  costToCharge: function() { return 0; },
	
	
	terminateTrial: function() {
		this.set('trial_started', new Date);
		this.setTimeout(function() {
			this.instance().terminate();
		}, 1000 * 60 * 10);
	}
});