Instance.extend({
	schema: {
		billing_method: {
	    	type: String,
				defaultValue: 'hourly'
	  		},
		github_url: {
		    type: String,
		    label: "Github URL",
			regEx: SimpleSchema.RegEx.Url,
			autoform: {
				placeholder: 'Github URL of your Project'
			}, 
			custom: function(simpleSchema) {
				if(this.github_url.indexOf('github.com') === -1) return 'mustBeGithubUrl';
			}
		},
		subdomain: {
		    type: String,
		    label: "Subdomain",
			autoform: {
				placeholder: 'my-project'
			},
			customAsync: function(callback) {
				this.isSubdomainUsed(function(isUsed) {
					callback(isUsed ? 'The subdomain you entered is already in use.' : null);
				});
			}
	  	},
		password: {
		    type: String,
		    label: "Password",
			optional: true,
			autoform: {
				placeholder: '(optional)'
			}
  		},	
		user_id: {
			type: String		
		},
		hide: {
			type: Boolean,		
			optional: true
		}
	},
	defaults: {
		billing_method: 'hourly'
	},
	defineErrorMessages: {
		mustBeGithubUrl: 'You must enter a Github URL'
	}
});