Meteor.startup(function() {
  AWS.config.update({
    accessKeyId: MasterConfig.keys.aws.accessKeyId,
    secretAccessKey: MasterConfig.keys.aws.secretAccessKey,
    region: 'us-west-1',
    apiVersion: '2014-10-01'
  });

  EC2 = new AWS.EC2();
});

EC2_Manager = {
  create_instance: function() {
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
      SecurityGroups: ['nucleus-ide-ami'],
      UserData: 'STRING_VALUE'
    };

    EC2.runInstances(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });
  },
  stop_instance: function() {

  }
};
