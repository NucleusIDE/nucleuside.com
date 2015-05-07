(function(login) { 
	Meteor.loginWithGithub = function() { 
		login({requestPermissions: ['user', 'repo']}, function(error) {
			if(!error) {
	  		if(!Meteor.user().hasNoInstances() || Session.get('free_trial_github_url')) {
	  			Router.go('new_instance', {step: 'billing-option'});
	  		}
				else Router.go('instances');
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