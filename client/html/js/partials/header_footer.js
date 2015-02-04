(function(login) { 
	Meteor.loginWithGithub = function() { 
		login({requestPermissions: ['user', 'repo']}, function(error) {
			if(!error) {
	  		if(!Meteor.user().hasNoInstances()) Router.go('billing_wizard');
				else Router.go('lab_sessions');
			}
		}); 
	};
})(Meteor.loginWithGithub);

Template.header.events({
  "click .github-login": Meteor.loginWithGithub
});

Template.footer.events({
  "click .github-login": Meteor.loginWithGithub
});