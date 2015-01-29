MasterConfig = {
  mode: function() {
    if (/nucleuside/.test(Meteor.absoluteUrl())) {
      return 'production';
    }
    return 'dev';
  },
  admins: {
    emails: ['ckhabra@gmail.com', 'james@faceyspacey.com', 'jamesgillmore@gmail.com', 'jamesg@faceyspacey.com']
  },
  keys: {
    stripe: "sk_test_1G7JFjnHhhVAERbaw0dncTmE",
    github: function() {
      if (MasterConfig.mode() == 'production') {
        return {
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
			cloudflare_api_interface: "https://www.cloudflare.com/api_json.html",
			cloudflare_token: "efb121eb6f63b931c15d2474cbcf8a0e1f85c",
			cloudflare_email: "jamesgillmore@gmail.com",
			domain: "nucleuside.com"
		}
  },
  stripe_plans: {
    monthly: 'monthly'
  }
};
