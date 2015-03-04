Ultimate('Order').extends(UltimateModel, 'orders', {
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
	},
	forms: function() {
		return {
			'billing_option': {
				keys: ['billing_method']
			},
			'order_details': {
				keys: ['github_url', 'subdomain', 'password']
				
				/**
				onSubmit: function(autoform, wizard) {
					console.log('EXAMPLE ONSUBMIT FROM FORM DEFINITION');
					autoform.done();
				**/
			}
		};
	},
	wizards: function() {
		return {
			'create_instance': [{
		      path: 'billing-option',
		      title: '1. Billing Option',
		      template: 'billing_option',
					barPercent: 20
		    },{
		      path: 'instance-details',
					form: 'order_details',
		      title: '2. Order Details',
		      template: 'order_details',
					barPercent: 45,
					onNext: function(wizard, autoform) {
						if(Meteor.user().valid_card) {
							wizard.setStepsCompleted(2);
							Session.set('redirect_to_new_instance_wizard_step_3', true);
							Router.go('payment_details');
						}
						else wizard.next();
					}
		    }, {
		      path: 'review',
		      title: '3. Review',
		      template: 'review',
					barPercent: 63,
		      onNext: function(wizard) { 
						this.createOrder();
						wizard.next();
		      }	
		    }, {
		      path: 'complete',
		      title: '4. Thank You!',
		      template: 'thank_you',
					barPercent: 100
		    }],
			'another_wizard': {}
		};
	},
  get_user: function() {
    return Meteor.users.findOne(this.user_id);
  },
  get_billing_method: function() {
    return this.billing_method;
  },
  get_cost_per_unit: function() {
    return this.cost_per_unit;
  },
  get_subdomain: function() {
    return this.subdomain;
  },
  get_github_url: function() {
    return this.github_url;
  },
	display_amount: function() {
		return this.billing_method === 'Monthly' ? '$160 / Month' : '$1 / hour used';
	},
  reset: function(last_charged) { //Reset order after a successful charge
    if (this.is_monthly()) return console.log("nothing to reset in monthly orders");

    last_charged = last_charged || moment().toDate();
    this.update({units_used: 0, last_charged: last_charged});
  },
  get_units_used: function() {
    return this.units_used;
  },
  get_billing_period: function() {
    return this.billing_period;
  },
  get_cost_to_charge: function() {
    if (this.is_monthly()) throw new Meteor.Error("What do you want here?");
    return this.cost_per_unit * this.units_used;
  },
  is_active: function() {
    return this.is_monthly() ? !!this.current_plan_start : !!this.last_charged;
  },
  get_last_charged: function() {
    return moment(this.last_charged).format('ddd MMMM DD, YYYY') || moment().format('ddd MMMM DD, YYYY');
  },
  set_last_charged: function(date) {
    if (!date) return;
    this.update({last_charged: date});
  },
  is_running: function() {
    return this.ec2().status === 'running';
  },
  is_monthly: function() {
    return this.billing_method === BILLING_METHODS.monthly.name;
  },
  is_hourly: function() {
    return this.billing_method === BILLING_METHODS.hourly.name;
  },
  get_aws_instance_id: function() {
    return this.aws.Instances[0].InstanceId || null;
  },
  check_instance_status: function(cb) {
    if (!this.instance_id) return cb(null, {status: "No instance"});
    Meteor.call("get_aws_instance_status", instance_id, cb);
  }
});

Orders.before.insert(function (userId, doc) {
  doc.created_at = moment().toDate();
});