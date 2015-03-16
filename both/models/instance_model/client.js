Instance.extendClient({
	createInstance: function() {
    BlockUI.block();
		
		this._createInstance(function(error, res) {
			BlockUI.unblock();
      if(error) Flash.danger(error.reason);
		});
	},
	isSubdomainUsed: function(callback) {
		this.subdomainUsedAlready(this.subdomain, function(err, res) {
			return res ? callback(true) : callback(false);
		});
	},
	ec2: function() {
		return this._ec2;
	}
});