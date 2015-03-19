Instance.extendHTTP({
	subdomainUsedAlready: function(subdomain) {
		return !!Orders.find({subdomain: subdomain}).count();
	},
	_createInstance: function() {
    this.setInitialValues();
		this.run();
		this.createOrder();
	},

	
  run: function() {
		this.ec2().run();
		this.save(); //the ec2 object props will save ;)	
		this.monitorStatus({onRunning: this.terminateTrial});
		this.linkSubdomain(this.ec2.instance_id);
  },
	terminate: function() {
    this.terminated_at = moment().toDate(); //used for hourly usage calculation
		this.ec2().terminate()
		this.monitorStatus();
		this.save();
	},
	reboot: function() {
		this.ec2().stop();
		this.monitorStatus({onStopped: this.ec2().start});
	},
	
	
	monitorStatus: function(callbacks) {
		var cbs = {onStatus: this.save}; //status set on this._ec2.status prior to save()
		
		_.each(_.extend(cbs, callbacks), function(cb, key) {
			cbs[key] = cb.bind(this);
		}.bind(this));
		
		this.ec2().monitorStatus(cbs);
	},
	terminateTrial: function() {
		if(this.billing_method != 'trial') return;
		
		this.order().set('trial_started', new Date);
		
		this.setTimeout(function() {
			this.terminate();
		}, 1000 * 60 * 10),
	}
});