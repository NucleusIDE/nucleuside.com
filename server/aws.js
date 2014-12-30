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
  stop_instance: function(instance_id, cb) {
    var params = {
      InstanceIds: [instance_id],
      Force: true
    };

    EC2.stopInstances(params, cb.future());
  },
  start_instance: function(instance_id, cb) {
    /**
     * Start stopped instance with 'instance_id'
     */
    var params = {
      InstanceIds: [ /* required */
        instance_id
      ]
    };

    EC2.startInstances(params, cb.future());
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
        if (err.name === "InvalidInstanceID.NotFound") {
          fut.return({
            status: "Terminated"
          });
        }
        fut.throw(err);
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
  },
  start_aws_instance: function(order_id) {
    var order = Orders.findOne(order_id),
        fut = new Future();

    if (! order || order.user_id !== this.userId) {
      fut.throw(new Meteor.Error("Invalid order for present user."));
    }

    var instance_id = order.get_aws_instance_id();
    if (! instance_id) {
      fut.throw(new Meteor.Error("Order doesn't have a stopped instance to start"));
    }
    EC2_Manager.start_instance(instance_id, function(err, data) {
      //data looks like : https://paste.ee/p/XM85W
      if (err) {
        console.log("ERROR WHILE LAUNCHING AWS INSTANCE FOR ORDER", order._id);
        fut.throw(new Meteor.Error(err));
      }

      order.update({
        aws_instance_stopped: false
      });

      fut.return(data);
    });
    return fut.wait();
  },
  stop_aws_instance: function(order_id) {
    var order = Orders.findOne(order_id),
        fut = new Future();
    if (! order || order.user_id !== this.userId) {
      fut.throw(new Meteor.Error("Invalid order for present user."));
    }

    var instance_id = order.get_aws_instance_id();
    EC2_Manager.stop_instance(instance_id, function(err, data) {
      // data = { StoppingInstances:
      //          [ { InstanceId: 'i-2eefd9e4',
      //              CurrentState: [Object],
      //              PreviousState: [Object] } ] }
      if (err) {
        console.log("ERROR WHILE STOPPING AWS INSTANCE for order", this._id, err);
        fut.throw(new Meteor.Error(err));
      }
      this.update({
        aws_instance_stopped: true,
        aws_instance_stopped_res: data
      });

      fut.return(data);
    });

    return fut.wait();
  }
});
