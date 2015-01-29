Order.extendServer({
	setInitialValues: function() {
    this.units_used = BILLING_METHODS[this.billing_method].min_units_used;
    this.cost_per_unit = BILLING_METHODS[this.billing_method].cost_per_unit;
		
		this.created_at = this.last_charged = moment().toDate(); //used in hourly orders only
	},
	start: function() {
		this.ec2.start();
	},
  stop: function() {
		this.ec2.stop();
  },
  activate: function() {
		this.ec2 = new EC2;
		this.ec2.launch();
		this.save(); //only the ec2 object props will save ;)
		
		this.linkSubdomain(this.ec2.instance_id);
  },
	terminate: function() {
    if(this.is_monthly()) {
			this.current_plan_start = null;
			this.current_plan_start = null;
			this.current_plan_start = null;
    }
    else this.last_charged = null;
		
		this.save();
		this.stop();
	},
	linkSubdomain: function(instanceId) {
		this.setTimeout(function() {
			this.ec2.getIpAddress();
			this.save(); //ip address on this.ec2.ip_address saved

			var cloudflare = new CloudFlare;
			cloudflare.linkSubdomain(this.subdomain, this.ec2.ip_address);
		}, 5 * 1000); //wait until instance exists
	}
});