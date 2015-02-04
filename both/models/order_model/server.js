Order.extendServer({
	setInitialValues: function() {
    this.units_used = BILLING_METHODS[this.billing_method].min_units_used;
    this.cost_per_unit = BILLING_METHODS[this.billing_method].cost_per_unit;
		
		this.created_at = this.last_charged = moment().toDate(); //used in hourly orders only
	},
	linkSubdomain: function(instanceId) {
		this.setTimeout(function() {
			this.ec2.getIpAddress();
			console.log(instanceId, this.ec2.ip_address);
			this.save(); //ip address on this.ec2.ip_address saved
			
			var cloudflare = new CloudFlare;
			cloudflare.linkSubdomain(this.subdomain, this.ec2.ip_address);
		}, 5 * 1000); //wait until instance exists
	}
});