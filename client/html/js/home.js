Ultimate('home').extends(UltimateTemplate, {
	rendered: function() {
		Prism.highlightAll();
	},
	'click #launch_instance a': function(e) {
		e.preventDefault();
		var githubUrl = $('#github-url').val();
		
		Session.set('free_trial_github_url', githubUrl);
		Router.go('new_instance', {step: 'billing-option'});
	}
});