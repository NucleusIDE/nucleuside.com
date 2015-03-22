Instance.extendHTTP({
	subdomainUsedAlready: function(subdomain) {
		return !!Instances.find({subdomain: subdomain, '_ec2.dns_record_id': {$ne: null}}).count();
	},
	_createInstance: function() {
    this.setInitialValues();
		this.run();
		this.createOrder();
	},

	
  run: function() {
		this.ec2().run();
		this.save(); //the ec2 object props will save ;)	
		this.monitorStatus(function() {
			this.launchApp();
			this.terminateTrial();
		});
		this.linkSubdomain(this.ec2.instance_id);
  },
	terminate: function() {
    this.terminated_at = moment().toDate(); //used for hourly usage calculation
		this.ec2().terminate()
		this.monitorStatus();
		this.save();
		this.unLinkSubdomain();
	},
	reboot: function() {
		this.ec2().stop();
		this.monitorStatus({
			onRunning: this.launchApp,
			onStopped: this.ec2().start
		});
	},
	
	
	monitorStatus: function(callbacks) {
		var cbs = {onStatus: this.save}; //status set on this._ec2.status prior to save()
		
		if(_.isFunction(callbacks)) callbacks = {onRunning: callbacks};
		
		_.each(_.extend(cbs, callbacks), function(cb, key) {
			cbs[key] = cb.bind(this);
		}.bind(this));
		
		this.ec2().monitorStatus(cbs);
	},
	terminateTrial: function() {
		if(this.orderIs('trial')) this.order().terminateTrial();
	}
});