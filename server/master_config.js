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
    },
    aws: {
      accessKeyId: "AKIAJ6TQDQPF2GR2Y2ZA",
      secretAccessKey: "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"
    }
  },
  stripe_plans: {
    monthly: 'monthly'
  }
};
