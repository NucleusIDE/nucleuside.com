Instanec.extendHTTP({
	subdomainUsedAlready: function(subdomain) {
		return !!Orders.find({subdomain: subdomain}).count();
	},
	_createInstance: function() {
    this.setInitialValues();
    this.save();
		if(this.is_monthly()) StripeSubscription.subscribe(this);
		this.run();
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
		this.ec2().reboot(this);
	},
	updateStatus: function() {
		this._ec2.status = this.ec2().getStatus();
		this.save();
	},
	
	
	monitorStatus: function(callbacks) {
		var cbs = {
			onStatus: function(status) {
				this._ec2.status = status; 
				this.save();
			}
		};
		
		_.extend(cbs, callbacks);
		_.each(cbs, function(cb, key) {
			cbs[key] = cb.bind(this);
		}.bind(this));
		
		this.ec2().monitorStatus(cbs);
	},
	terminateTrial: function() {
		if(this.billing_method != 'trial') return;
		
		this.set('trial_started', new Date);
		
		this.setTimeout(function() {
			this.terminate();
		}, 1000 * 60 * 10),
	},
	
	
	cancelSubscription: function() {
		StripeSubscription.cancel(this);
	},
	hideInstance: function() {
		this.update({hide: true});
	}
});