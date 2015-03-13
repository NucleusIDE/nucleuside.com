Ultimate('Utilities').extends();

Utilities.extendStatic({
	countdown: function(oldDate, minutes, seconds) {
		var totalSeconds = seconds ? (minutes * 60) + seconds : minutes * 60;
			totalSecondsRemaining = totalSeconds - Math.floor((new Date - oldDate)/1000)
			minutesRemaining = Math.floor(totalSecondsRemaining/60),
			secondsRemaining = Math.floor(totalSecondsRemaining % 60);
	
		if(secondsRemaining < 10) secondsRemaining = '0'+secondsRemaining;
	
		return minutesRemaining + ':' + secondsRemaining;
	}
});
