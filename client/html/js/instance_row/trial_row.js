Ultimate('trial_row').extends(InstanceRow, {
	status: function() {
		var trialStart = this.model().trial_started,
			status = this.model().ec2().status;
		
		if(trialStart && status == 'running') {
			this.setReactiveIntervalUntil(function() {
				return status != 'running';
			}, 1000);
			
			return Utilities.countdown(trialStart, 10);
		}
		else return status;
	}
});

