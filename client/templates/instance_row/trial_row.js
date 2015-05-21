Ultimate('trial_row').extends(InstanceRow, {
	status: function() {
		var trialStart = this.model().order().trial_started,
			status = this.model().status();
		
		if(trialStart && status == 'running') {
			this.setReactiveIntervalUntil(function() {
				return status != 'running';
			}, 1000);
			
			return Utilities.countdown(trialStart, 10);
		}
		else return status;
	}
});

