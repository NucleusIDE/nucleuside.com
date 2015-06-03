Instance.extendHttp({
	subdomainUsedAlready: function(subdomain) {
		return !!Instances.find({subdomain: subdomain, '_ec2.dns_record_id': {$ne: null}}).count();
	},


	processOrder: function() {
		this.startServer();
		this.createOrder();
	},
	createOrder: function() {
		this.order_id = Order.createOrder(this.billing_method, this._id);
		this.save(); //the ec2 object props (instance_id) will also save ;)
	},


	startServer: function() {
		if(this.ec2.instance_id) this.terminate();
		this.run();
		
		console.log('EC2', this.ec2.status, this.ec2.instance_id, this.getAllMongoAttributes());
		this.save();
		this.monitor(function() {
			this.launchApp();
			this.terminateTrial();
		});

		this.linkSubdomain();
	},
	shutdown: function() {
		console.log(this.terminate);
		this.terminated_at = moment().toDate(); //used for hourly usage calculation
		this.terminate()
		this.monitor();
		this.save();
		this.unLinkSubdomain();
	},
	reboot: function() {
		this.stop();
		this.monitorStatus({
			onRunning: this.launchApp,
			onStopped: this.start
		});
	},


	monitor: function(callbacks) {
		callbacks = _.isFunction(callbacks) ? {onRunning: callbacks} : (callbacks || {});
		callbacks.onStatus = this.save.bind(this); //status set on this._ec2.status prior to save()
		callbacks = _.bindContext(callbacks, this);
		
		this.monitorStatus(callbacks);
	},
	terminateTrial: function() {
		if(this.orderIs('trial')) this.order().terminateTrial();
	}
});