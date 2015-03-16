Ultimate('Utilities').extends();

Utilities.extendStatic({
	countdown: function(oldDate, minutes, seconds) {
		var totalSeconds = seconds ? (minutes * 60) + seconds : minutes * 60,
			remainingSeconds = totalSeconds - moment().diff(oldDate, 'seconds'),
			minutesRemaining = Math.floor(remainingSeconds/60),
			secondsRemaining = Math.floor(remainingSeconds % 60);
	
		if(secondsRemaining < 10) secondsRemaining = '0'+secondsRemaining;
	
		return minutesRemaining + ':' + secondsRemaining;
	}
});
