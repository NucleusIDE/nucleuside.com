EC2 = function EC2(doc) {
	if(doc) _.extend(this, doc);
};

EC2.extends(Base, {
	_runInstances: function(params) {
		return this.applySync(this.___ec2, 'runInstances', [params]);
	},
	_startInstances: function() {
		return this.applySync(this.___ec2, 'startInstances', [this._params()]);
	},
	_stopInstances: function(params) {
		_.extend(params, this._params());
		return this.applySync(this.___ec2, 'stopInstances', [params]);
	},
	_terminateInstances: function(params) {
		_.extend(params, this._params());
		return this.applySync(this.___ec2, 'terminateInstances', [params]);
	},
	_describeInstances: function() {
		return this.applySync(this.___ec2, 'describeInstances', [this._params()]);
	},
	
	_params: function() {
		return {InstanceIds: [this.instance_id]};
	},
	
  _start: function() {
		this._startInstances();
  },
  _stop: function() {
		this._stopInstances({Force: true});
  }
});


EC2.extendStatic({
	onStartup: function() {
	  AWS.config.update({
	    accessKeyId: MasterConfig.aws().accessKeyId,
	    secretAccessKey: MasterConfig.aws().secretAccessKey,
	    region: 'us-west-1',
	    apiVersion: '2014-10-01'
	  });
		
	  this.___ec2 = this.prototype.___ec2 = new AWS.EC2({});
	}
});