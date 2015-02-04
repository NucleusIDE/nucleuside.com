Meteor.startup(function() {
  /**
   * configure roles
   */
  if(Meteor.roles.find().count() === 0) {
    Roles.createRole('user');
    Roles.createRole('admin');
  }

  /**
   * configure github
   */
  ServiceConfiguration.configurations.remove({
    service: "github"
  });
  ServiceConfiguration.configurations.insert({
    service: "github",
    clientId: MasterConfig.github().clientId,
    secret: MasterConfig.github().secret,
		loginStyle: "popup"
  });
});
