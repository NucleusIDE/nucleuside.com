Ultimate('TrialOrder').extends(Order, {
	schema: function() {
		return _.extend({}, this.callParent('schema'), {
			  trial_started: {
			    	type: Date,
			  }
		});
	},

	defaults: function() {
	    return _.extend({}, this.callParent('defaults'), {
			billing_method: 'trial', 
			units_used: Order.BILLING_METHODS.trial.min_units_used,
			cost_per_unit: Order.BILLING_METHODS.trial.cost_per_unit
	    });
  	},


  	costToCharge: function() { 
  		return 0; 
  	},
	
	
	countdownToTermination: function(templateInstance) {
		var trialStart = this.trial_started,
			status = this.instance().getStatus(),
			lapsedMinutes = moment().diff(moment(trialStart).toDate(), 'minutes'),
			maxCalls = (Config.trialLengthMinutes - lapsedMinutes + 1) * 60;
		
		if(trialStart && status == 'running' && lapsedMinutes < Config.trialLengthMinutes) {
			templateInstance.setReactiveIntervalUntil(function() {
				return status != 'running';
			}, 1000, this._id, maxCalls);
			
			return 'Trial Remaining: ' + Utilities.countdown(trialStart, Config.trialLengthMinutes);
		}
		else return status;
	}
});

TrialOrder.extendServer({
	setTerminateTrialTimeout: function() {
		this.set('trial_started', new Date);
		
		this.setTimeout(function() {
			this.instance().terminate();
		}, 1000 * 60 * Config.trialLengthMinutes);
	}
});