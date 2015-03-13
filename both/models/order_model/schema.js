Order.extend({
	schema: function() {
		return {
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
				type: String,		
			},
			num: {
				type: Number,		
			},
			units_used: {
				type: Number,		
			},
			last_charged: {
				type: Date,		
			},
			current_plan_start: {
				type: Number,		//we should converte these to/from Date objects
			},
			current_plan_end: {
				type: Number,		
			},
			hide: {
				type: Boolean,		
			}
			
		};
	},
	defaultValues: {
		billing_method: 'monthly'
	},
	defineErrorMessages: function() {
		return {
			mustBeGithubUrl: 'You must enter a Github URL'
		};
	}
});