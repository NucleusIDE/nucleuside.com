Ultimate('ServerStartup').extends(UltimateStartup, {
	setupRoles: function() {
		if(Meteor.roles.find().count() > 0) return;
		
    Roles.createRole('user');
    Roles.createRole('admin');
	},
	
	
	configureGithubService: function() {
    this._removeGithubService();
    this._insertGithubService();
	},
	
	_removeGithubService: function() {
		ServiceConfiguration.configurations.remove({service: "github"});
	},
	_insertGithubService: function() {
    ServiceConfiguration.configurations.insert({
      service: "github",
      clientId: ConfigServer.github.clientId,
      secret: ConfigServer.github.secret,
      loginStyle: "popup"
    });
	}
});