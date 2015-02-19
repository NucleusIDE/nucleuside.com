MasterConfig = {
  mode: function() {
    if (/nucleuside/.test(Meteor.absoluteUrl())) return 'production';
    return 'development';
  },
	isProduction: function() {
		return this.mode() == 'production';
	},
	
  stripe: function() {
  	if(this.isProduction()) return 'pk_live_EHIjjs57lpmzmSNt5RXaVWOv';
		else return 'pk_test_clkUF9NuYuZhoFD7fiLlwbq0';
  }
};

BlockUI.configure({
  spinnerStyle: "background-color: #45B9C2;"
});

