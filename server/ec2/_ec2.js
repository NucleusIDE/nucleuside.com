var EC2 = function EC2(doc) {
	if(doc) _.extend(this, doc);
};

EC2.extends(Base, {
	_runInstances: function(params) {
		return this.applySync(this._ec2, 'runInstances', [params]);
	},
	_startInstances: function(params) {
		return this.applySync(this._ec2, 'startInstances', [params]);
	},
	_stopInstances: function(params) {
		return this.applySync(this._ec2, 'stopInstances', [params]);
	},
	_describeInstances: function(params) {
		return this.applySync(this._ec2, 'describeInstances', [params]);
	},
	
	_params: function() {
		return {InstanceIds: [this.instance_id]};
	}
});

EC2.extendStatic({
	onStartup: function() {
	  AWS.config.update({
	    accessKeyId: MasterConfig.keys.aws.accessKeyId,
	    secretAccessKey: MasterConfig.keys.aws.secretAccessKey,
	    region: 'us-west-1',
	    apiVersion: '2014-10-01'
	  });
		
	  this._ec2 = this.prototype._ec2 = new AWS.EC2({});
	}
});