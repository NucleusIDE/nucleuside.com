AWS.config.update({
  accessKeyId: MasterConfig.keys.aws.accessKeyId,
  secretAccessKey: MasterConfig.keys.aws.secretAccessKey
});

EC2 = new AWS.EC2({apiVersion: '2014-10-01'});
