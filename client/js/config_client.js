Ultimate('ConfigClient').extends(UltimateConfig, {	
	production: {
		stripe: 'pk_live_EHIjjs57lpmzmSNt5RXaVWOv',
		hostedDomain: 'theultimateide.com'
	},
	development: {
		stripe: 'pk_test_clkUF9NuYuZhoFD7fiLlwbq0',
		hostedDomain: 'moralmoneymatters.com'
	},
	trialLengthMinutes: 10
});

Config = ConfigClient;

BlockUI.configure({
  spinnerStyle: "background-color: #45B9C2;"
});




