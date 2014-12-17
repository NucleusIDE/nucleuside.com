Meteor.startup(function() {
  ServiceConfiguration.configurations.remove({
    service: "github"
  });
  ServiceConfiguration.configurations.insert({
    service: "github",
    clientId: MasterConfig.keys.github().clientId,
    loginStyle: "redirect",
    secret: MasterConfig.keys.github().secret
  });
});
