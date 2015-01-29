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
	},
	
  start: function() {
		this._startInstances(this._params());
		this.ec2.active = true;
  },
  stop: function() {
    var params =  this._params();
		params.Force = true;
		this._stopInstances(params);
		this.ec2.active = false;
  },
	
  getStatus: function() {
    var res = this._describeInstances(this._params());
		if(res.error && res.error.name === "InvalidInstanceID.NotFound") return this.status = 'terminated';
		return this.status = res.data.Reservations[0].Instances[0].state.name;
  },
	getIpAddress: function() {
		var res = this._describeInstances(this._params());
		return this.ip_address = res.data.Reservations[0].Instances[0].PublicIpAddress;
	},
	
  launch: function() {
    var params = {
      ImageId: 'ami-61c6db24', /* custom ami with ubuntu, node, meteor and git */
      MaxCount: 1, /* required */
      MinCount: 1, /* required */
      InstanceInitiatedShutdownBehavior: 'stop',
      InstanceType: 't2.small', // m2.small',
      KeyName: 'NucleusIDE-us-west-1',
      Monitoring: {
        Enabled: true
      },
      // SecurityGroups: ['nucleus-ide-ami'],
      SubnetId: "subnet-29180f6f"
    };
		
		var res = this._runInstances(params);
		
		if(res.error) {
			this.status = 'error';
			throw new Meteor.Error('unable-to-launch-instance', "UNABLE TO LAUNCHING ORDER INSTANCE", this._id);
		}
		else {
			this.status = 'pending';
			this.aws_instance_stopped = false;
			return this.instance_id = res.data.Instances[0].InstanceId;
		}
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