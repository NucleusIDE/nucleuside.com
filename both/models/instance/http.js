Instance.extendHttp({
	subdomainUsedAlready: function(subdomain) {
		return !!Instances.find({subdomain: subdomain, '_ec2.dns_record_id': {$ne: null}}).count();
	},


	processOrder: function() {
		this.setInitialValues();
		this.createOrder();
		this.run();
	},
	setInitialValues: function() {
		this.units_used = Order.BILLING_METHODS[this.billing_method].min_units_used;
		this.cost_per_unit = Order.BILLING_METHODS[this.billing_method].cost_per_unit;
		this.last_charged = new Date; //used in hourly orders only
	},
	createOrder: function() {
		var OrderClass = BILLING_METHODS[this.billing_method].class(),
		  order = new OrderClass({instance_id: this._id, user_id: Meteor.userId(), billing_method: this.billing_method});

		this.order_id = order.save();
	},


	run: function() {
		this.run();
		this.save(); //the ec2 object props (instance_id) will save ;)	

		this.monitor(function() {
			this.launchApp();
			this.terminateTrial();
		});

		this.linkSubdomain();
	},
	shutdown: function() {
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
		callbacks.onStatus = this.save; //status set on this._ec2.status prior to save()
		callbacks = _.bindContext(callbacks, this);
		
		this.monitorStatus(callbacks);
	},
	terminateTrial: function() {
		if(this.orderIs('trial')) this.order().terminateTrial();
	}
});