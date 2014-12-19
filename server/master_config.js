MasterConfig = {
  mode: function() {
    if (/nucleuside/.test(Meteor.absoluteUrl())) {
      return 'production';
    }
    return 'dev';
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
    }
  },
  stripe_plans: {
    monthly: 'monthly'
  }
};
