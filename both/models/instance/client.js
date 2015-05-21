Instance.extendClient({
	createInstance: function() {
	    BlockUI.block();
			
		this.processOrder(function(error, res) {
			BlockUI.unblock();
	      	if(error) Flash.danger(error.reason);
		});
	},
	isSubdomainUsed: function(callback) {
		this.subdomainUsedAlready(this.subdomain, function(err, res) {
			return res ? callback(true) : callback(false);
		});
	}
});