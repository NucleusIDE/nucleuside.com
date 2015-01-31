MasterConfig = {
  mode: function() {
    if (/nucleuside/.test(Meteor.absoluteUrl())) return 'production';
    return 'development';
  },
	isProduction: function() {
		return MasterConfig.mode() == 'production';
	},
	instance_domain: function() {
		if(MasterConfig.isProduction()) return "nucleuside.com";
		else 'moralmoneymatters.com';
	},
  admins: {
    emails: ['ckhabra@gmail.com', 'james@faceyspacey.com', 'coder@nucleuside.com']
  },
  keys: {
    stripe: function() {
    	if(MasterConfig.isProduction()) return 'sk_test_xZXeiSOixGWQhQxAM7lqmJCP';
			else return 'sk_live_LIJpVdJGPgquuT1iwDIU5fo6';
    },
    github: function() {
      if(MasterConfig.isProduction()) {
        return {
        	clientId: "3bffcdce163a675e64b8",
        	secret: "df984df5ccd772a67060cb0aa4704c7aade064e9"
      	};
      }
      return {
        clientId: "3bffcdce163a675e64b8",
        secret: "df984df5ccd772a67060cb0aa4704c7aade064e9"
      };
    },
    aws: {
      accessKeyId: "AKIAJ6TQDQPF2GR2Y2ZA",
      secretAccessKey: "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"
    },
		cloudflare: {
			url: "https://www.cloudflare.com/api_json.html",
			token: "efb121eb6f63b931c15d2474cbcf8a0e1f85c",
			email: "coder@nucleuside.com",
			domain: MasterConfig.instance_domain()
		}
  },
  stripe_plans: {
    monthly: function() {
    	return MasterConfig.isProduction() ? 'monthly_instance_production' : 'monthly_instance_development';
    }
  }
};
