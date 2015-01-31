MasterConfig = {
  mode: function() {
    if (/nucleuside/.test(Meteor.absoluteUrl())) return 'production';
    return 'development';
  },
	isProduction: function() {
		return MasterConfig.mode() == 'production';
	},
  keys: {
    stripe: function() {
    	if(this.isProduction()) return 'pk_test_clkUF9NuYuZhoFD7fiLlwbq0';
			else return 'sk_live_LIJpVdJGPgquuT1iwDIU5fo6';
    }
  }
};

BlockUI.configure({
  spinnerStyle: "background-color: #45B9C2;"
});

