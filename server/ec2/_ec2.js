Ultimate('EC2').extends({
	construct: function(doc) {
		if(doc) _.extend(this, doc);
	},
	_runInstances: function(params) {
		return this.applySync(this.__ec2(), 'runInstances', [params]);
	},
	_startInstances: function() {
		return this.applySync(this.__ec2(), 'startInstances', [this._params()]);
	},
	_stopInstances: function(params) {
		_.extend(params, this._params());
		return this.applySync(this.__ec2(), 'stopInstances', [params]);
	},
	_terminateInstances: function() {
		return this.applySync(this.__ec2(), 'terminateInstances', [this._params()]);
	},
	_describeInstances: function() {
		return this.applySync(this.__ec2(), 'describeInstances', [this._params()]);
	},
	
	
	_params: function() {
		return {InstanceIds: [this.instance_id]};
	},
	
	
  _start: function() {
		this._startInstances();
  },
  _stop: function() {
		this._stopInstances({Force: true});
  },
	
	
	__ec2: function() {
		if(this.___proto.___ec2) return this.___proto.___ec2;
		
	  AWS.config.update({
	    accessKeyId: MasterConfig.aws().accessKeyId,
	    secretAccessKey: MasterConfig.aws().secretAccessKey,
	    region: 'us-west-1',
	    apiVersion: '2014-10-01'
	  });
		
	  return this.___proto.___ec2 = new AWS.EC2({});
	}
});