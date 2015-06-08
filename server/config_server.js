Ultimate('ConfigServer').extends(UltimateConfig, {	
	production: {
		stripe: {
			secretKey: 'sk_live_LIJpVdJGPgquuT1iwDIU5fo6', 
			monthlyPlan: 'monthly_instance_production'
		},
		github: {
			clientId: "3bffcdce163a675e64b8", 
			secret: "df984df5ccd772a67060cb0aa4704c7aade064e9"
		},
		hostedDomain: 'moralmoneymatters.com'
	},
	
	development: {
		stripe: {
			secretKey: 'sk_test_xZXeiSOixGWQhQxAM7lqmJCP', 
			monthlyPlan: 'monthly_instance_development'
		},
		github: {
			clientId: "3bffcdce163a675e64b8", 
			secret: "df984df5ccd772a67060cb0aa4704c7aade064e9"
		},
		hostedDomain: 'theultimateide.com'
	},
	
	trialLengthMinutes: 10,
	
  	adminEmails: ['ckhabra@gmail.com', 'james@faceyspacey.com', 'coder@nucleuside.com'],
  	aws: {
		accessKeyId: "AKIAJ6TQDQPF2GR2Y2ZA", 
		secretAccessKey: "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"
	},
	cloudflare: function() {
		return {
			url: "https://www.cloudflare.com/api_json.html",
			token: "efb121eb6f63b931c15d2474cbcf8a0e1f85c",
			email: "coder@nucleuside.com",
			domain: this.isEnvironment('production') ? 'nucleuside.com' : 'moralmoneymatters.com'
		};
	}
});

Config = ConfigServer;