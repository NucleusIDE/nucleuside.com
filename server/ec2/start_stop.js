EC2.extend({
  terminate: function() {
		this._terminateInstances();
		this.active = false;
  },
	reboot: function(order) {
		this._stop();
		
		this.setIntervalUntil(function() {
			var status = this.getStatus(order); //status saved in order at order.ec2.status
			
			if(status === 'stopped') {
				this._start();
				return true;
			}
		}, 5000);
	},
  getStatus: function(order) {
    var res = this._describeInstances();
		if(res.error && res.error.name === "InvalidInstanceID.NotFound") return this.status = 'terminated';
		this.status = res.data.Reservations[0].Instances[0].state.name;
		
		if(order) order.save(); //a little awkward, i know
		
		return this.status;
  },
	getIpAddress: function() {
		var res = this._describeInstances();
		return this.ip_address = res.data.Reservations[0].Instances[0].PublicIpAddress;
	},
	
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