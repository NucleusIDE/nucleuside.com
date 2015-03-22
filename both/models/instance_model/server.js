Instance.extendServer({
	setInitialValues: function() {
    this.units_used = Order.BILLING_METHODS[this.billing_method].min_units_used;
    this.cost_per_unit = Order.BILLING_METHODS[this.billing_method].cost_per_unit;
		this.created_at = this.last_charged = moment().toDate(); //used in hourly orders only
	},
	linkSubdomain: function(instanceId) {
		this.setTimeout(function() {
			this.ec2().getIpAddress();	
			this._ec2.dns_record_id = Cloudflare.linkSubdomain(this.subdomain, this.ec2().ip_address);
			this.save(); //this._ec2.ip_address also saved
		}, 5 * 1000); //wait until instance exists
	},
	unLinkSubdomain: function(instanceId) {
		Cloudflare.unLinkSubdomain(this._ec2.dns_record_id);
		this._ec2.dns_record_id = null;
		this.save();
	},
	createOrder: function() {
		var OrderClass = BILLING_METHODS[this.billing_method].class(),
			order = new OrderClass({instance_id: this._id, user_id: Meteor.userId(), billing_method: this.billing_method}),
			id = order.save();
			
		this.set('order_id', id);
	},
	
	
	launchApp: function() {
		var commands = [
				'rm -R ' + this.githubPath(), 
				this.cloneCommand(), 
				'cd ' + this.githubPath(), 
				'meteor --port 80'
			],
			options = {
				stdout: function(data) {
					if(data.indexOf('App running at') > -1) this.notifyHome('launched');
				}.bind(this),
				stderr: function(data) {
					this.notifyHome('failed');
				}.bind(this)
			},
			rexec = new UltimateRemoteExec(this.ec2().ip_address, commands, options);
		
		rexec.exec();
	},
	getCloneCommand: function() {
		var token = this.user().getGithubToken(),
			githubPath = this.getGithubPath();
		
		return 'git clone https://'+token+':x-oauth-basic@github.com/' + githubPath;
	},
	githubPath: function() {
		return this.github_url.replace('http://github.com/', '');
	},
	notifyHome: function(status) {
		this._ec2.status = 'launched';
		this.save();
	}
});