EC2.extend({
	proxyMethods: ['run', 'terminate', 'start', 'stop', 'monitorStatus', 'getStatus', 'getIpAddress'],

	run: function() {
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
			//SecurityGroups: ['nucleus-ide-ami'],
			SubnetId: "subnet-29180f6f"
		};
			
		var res = this._runInstances(params);
		
		if(res.error) {
			this.status = 'error';
			throw new Meteor.Error('unable-to-launch-instance', "UNABLE TO LAUNCHING ORDER INSTANCE", this._id);
		}
		else {
			this.status = 'pending';
			return this.instance_id = res.data.Instances[0].InstanceId;
		}
  },
	
	
	terminate: function() {
		this._terminateInstances();
	},
	start: function() {
		this._startInstances();
	},
	stop: function() {
		this._stopInstances({Force: true});
	},


	monitorStatus: function(cbs) {
		this.setIntervalUntil(function() {
			var status = this.acquireStatus(); //status saved in order at order.ec2.status	
			
			if(_.isObject(cbs)) {
				if(status == 'running' && cbs.onRunning) cbs.onRunning.call(this);
				if(status == 'terminated' && cbs.onTerminated) cbs.onTerminated.call(this);
				if(status == 'stopped' && cbs.onStopped) cbs.onStopped.call(this);
				if(cbs.onStatus) cbs.onStatus.call(this, status);
			}
			
			if(status == 'running' || status == 'terminated' || status == 'stopped') return true;
		}, 5000, 100);
	},

	acquireStatus: function() {
		var res = this._describeInstances(),
			status;
			
		if(res.error && res.error.name === "InvalidInstanceID.NotFound") status = 'terminated';
		else status = res.data.Reservations[0].Instances[0].State.Name;
		
		return this.status = status;
	},
	acquireIpAddress: function() {
		var res = this._describeInstances();
		return this.ip_address = res.data.Reservations[0].Instances[0].PublicIpAddress;
	},


	getStatus: function() {
		return this.status;
	},
	getIpAddress: function() {
		return this.ip_address;
	}
});