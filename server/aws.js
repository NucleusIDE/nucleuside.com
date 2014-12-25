Future = Npm.require('fibers/future');

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

    EC2.runInstances(params, cb.future());
  },
  stop_instance_of_order: function(instance_id, cb) {
    var params = {
      InstanceIds: [instance_id],
      Force: true
    };

    EC2.stopInstances(params, cb.future());
  },
  describe_status: function(instance_id, cb) {
    var params = {
      InstanceIds: [instance_id]
    };
    EC2.describeInstanceStatus(params, cb.future());
  }
};


Meteor.methods({
  get_aws_instance_status: function(instance_id) {
    var fut = new Future();

    EC2_Manager.describe_status(instance_id, function(err, data) {
      if (err) {
        console.log("ERROR WHILE CHECKING STATUS");
        fut.return(new Error("ERROR WHILE CHECKING STATUS", err));
      }

      var aws_status = '';
      try {
        aws_status = data.InstanceStatuses[0].InstanceStatus.Status;
      } catch (e) {
        aws_status = 'Verifying...';
      }

      var status = 'Checking...';

      switch(aws_status) {
      case 'ok':
        status = 'Active';
        break;
      default:
        status = aws_status;
      }

      fut.return({
        status: status
      });
    });

    return fut.wait();
  }
});
