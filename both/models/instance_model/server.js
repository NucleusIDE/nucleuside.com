Instance.extendServer({
	setInitialValues: function() {
    this.units_used = Order.BILLING_METHODS[this.billing_method].min_units_used;
    this.cost_per_unit = Order.BILLING_METHODS[this.billing_method].cost_per_unit;
		this.created_at = this.last_charged = moment().toDate(); //used in hourly orders only
	},
	linkSubdomain: function(instanceId) {
		this.setTimeout(function() {
			this.ec2().getIpAddress();
			this.save(); //this._ec2.ip_address saved
			Cloudflare.linkSubdomain(this.subdomain, this.ec2().ip_address);
		}, 5 * 1000); //wait until instance exists
	},
	createOrder: function() {
		var OrderClass = BILLING_METHODS[this.billing_method].class,
			order = new OrderClass(this._id);
			
		order.save();
	}
});