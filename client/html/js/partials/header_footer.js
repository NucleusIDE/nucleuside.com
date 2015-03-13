(function(login) { 
	Meteor.loginWithGithub = function() { 
		login({requestPermissions: ['user', 'repo']}, function(error) {
			if(!error) {
	  		if(!Meteor.user().hasNoInstances() || Session.get('free_trial_github_url')) Router.go('new_instance');
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