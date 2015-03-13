Order.extendHTTP({
	subdomainUsedAlready: function(subdomain) {
		return !!Orders.find({subdomain: subdomain}).count();
	},
	_createOrder: function() {
    this.setInitialValues();
    this.save();

		if (this.is_monthly()) {
			var stripeSubscription = new StripeSubscription(this);
			stripeSubscription.subscribe();
		}
		
		this.run();
		return this._id;
	},

	
  run: function() {
		this.ec2().run();
		this.save(); //the ec2 object props will save ;)
		
		this.monitorStatus({onRunning: this.terminateTrial.bind(this)});
		
		this.linkSubdomain(this.ec2.instance_id);
  },
	terminate: function() {
    if(this.is_monthly()) {
			this.current_plan_start = null;
			this.current_plan_start = null;
			this.current_plan_start = null;
    }
    else this.last_charged = null;
		
		console.log('EC2', this.ec2());
		this.ec2().terminate()
		this.monitorStatus();
		this.save();
	},
	reboot: function() {
		this.ec2().reboot(this);
	},
	updateStatus: function() {
		this.ec2().getStatus();
		this.save();
	},
	
	
	monitorStatus: function(callbacks) {
		var cbs = {
			onStatus: function(status) {
				this._ec2.status = status; 
				this.save();
			}.bind(this)
		};
		
		_.extend(cbs, callbacks);
		
		this.ec2().monitorStatus(cbs);
	},
	terminateTrial: function() {
		if(this.billing_method != 'trial') return;
		
		this.set('trial_start_time', new Date);
		
		this.setTimeout(function() {
			this.terminate();
		}, 1000 * 60 * 10),
	},
	
	
	cancelSubscription: function() {
		var subscription = new StripeSubscription(this);
		subscription.cancel();
	},
	hideInstance: function() {
		this.update({hide: true});
	}
});