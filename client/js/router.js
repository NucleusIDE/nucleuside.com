Ultimate('ClientRouter').extends(UltimateRouter, {
	layoutTemplate: 'layout', 
	onBeforeAction: function() {
		if(!Meteor.userId() && this._layout._template != 'public_layout') {
			Meteor.loginWithGithub();
			this.render('home');
		}
		else this.next();
	},
	
	home: {
		path: '/',
		layoutTemplate: 'public_layout'
  	},
	'/new-instance/:step': function() {
		return new Instance().reactive('new_instance'); 
	},
	'instances': function() {
		return Instances.find();
	},
	payment_info: function()  {
		return new CreditCard().reactive('new_credit_card', true); 
	},
	billing_history: function() {
    	return Meteor.subscribe('my-payments');
  	},
	'/invoice/:payment_id': {
    	waitOn: function() {
	      	return Meteor.subscribe('my-payment', this.params.payment_id);
	    },
    	data: function() {
			return Payments.findOne(this.params.payment_id);
	    }
  	},
	logout: function() {
	    Meteor.logout(function() {
	      	this.redirect("home");
	    }.bind(this));
  	}
});