Meteor.startup(function() {
  AWS.config.update({
    accessKeyId: MasterConfig.keys.aws.accessKeyId,
    secretAccessKey: MasterConfig.keys.aws.secretAccessKey,
    region: 'us-west-1',
    apiVersion: '2014-10-01'
  });

  EC2 = new AWS.EC2({

  });
});

EC2_Manager = {
  launch_instance: function(cb) {
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

    EC2.runInstances(params, cb);
  },
  stop_instance_of_order: function(instance_id, cb) {
    var params = {
      InstanceIds: [instance_id],
      Force: true
    };

    EC2.stopInstances(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });
  },
  describe_status: function(instance_id, cb) {
    var params = {
      InstanceIds: [instance_id]
    };
    EC2.describeInstanceStatus(params, cb);
  }
};
