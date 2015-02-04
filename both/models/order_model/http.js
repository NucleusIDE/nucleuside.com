Order.extendHTTP({
	subdomainUsedAlready: function(subdomain) {
		return !!Orders.find({subdomain: subdomain}).count();
	},
	_createOrder: function() {
    this.setInitialValues();
    this.save();

		if (this.is_monthly()) {
			var stripeSubscription = new StripeSubscription(this);
			stripeSubscription.subsribe();
		}
		
		this.run();
		return this._id;
	},
	
  run: function() {
		this.ec2 = this.ec2 || new EC2;
		this.ec2.run();
		this.ec2.monitorStatus(this);
		this.save(); //the ec2 object props will save ;)
		
		this.linkSubdomain(this.ec2.instance_id);
  },
	terminate: function() {
    if(this.is_monthly()) {
			this.current_plan_start = null;
			this.current_plan_start = null;
			this.current_plan_start = null;
    }
    else this.last_charged = null;
		
		this.ec2.terminate()
		this.save();
	},
	reboot: function() {
		this.ec2.reboot(this);
	},
	updateStatus: function() {
		this.ec2.getStatus();
		this.save();
	},
	
	cancelSubscription: function() {
		var subscription = new StripeSubscription(this);
		subscription.cancel();
	},
	hideInstance: function() {
		this.update({hide: true});
	}
});