Order.extendServer({
	setInitialValues: function() {
    this.units_used = Order.BILLING_METHODS[this.billing_method].min_units_used;
    this.cost_per_unit = Order.BILLING_METHODS[this.billing_method].cost_per_unit;
		
		this.created_at = this.last_charged = moment().toDate(); //used in hourly orders only
	},
	linkSubdomain: function(instanceId) {
		this.setTimeout(function() {
			this.ec2().getIpAddress();
			console.log(instanceId, this.ec2().ip_address);
			this.save(); //ip address on this.ec2.ip_address saved
			
			var cloudflare = new CloudFlare;
			cloudflare.linkSubdomain(this.subdomain, this.ec2.ip_address);
		}, 5 * 1000); //wait until instance exists
	},
	ec2: function() {
		if(!this._ec2) return this._ec2 = new EC2; //this is a new order
		else return this._ec2._runInstances ? this._ec2 : new EC2(this._ec2); //EC2 wrapped already : not wrapped
	}
});