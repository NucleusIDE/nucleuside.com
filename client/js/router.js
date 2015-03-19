PublicController = RouteController.extend({layoutTemplate: 'public_layout'});

Router.configure({
	layoutTemplate: 'layout', 
	onBeforeAction: function() {
		var controllerName = this.route.options.controller;

		if(!Meteor.userId() && controllerName != 'PublicController') {
			Meteor.loginWithGithub();
			this.render('home');
		}
		else this.next();
	}
});

Router.setTemplateNameConverter(function (str) { return str; });

Router.map(function() {
  this.route("/", {
    name: "home",
		controller: 'PublicController'
  });

  this.route("/new-instance/:step", {
    name: "new_instance",
		data: function()  {
			return new Order().reactive('new_instance'); 
		}
  });
	
	
  this.route("/instances", {
		data: function() {
			return {Instances.find();
		},
    name: "instances"
  });

  this.route("/billing-history", {
    waitOn: function() {
      return Meteor.subscribe('my-payments');
    },
    name: "billing_history"
  });

  this.route("/payment-info", {
    name: "payment_info",
		data: function()  {
			return new CreditCard().reactive('new_credit_card', true); 
		}
  });

  this.route("invoice", {
    path: "/invoice/:payment_id",
    waitOn: function() {
      return Meteor.subscribe('my-payment', this.params.payment_id);
    },
    data: function() {
			return Payments.findOne(this.params.payment_id);
    },
		name: 'invoice'
  });
	
  this.route("/logout", {
    action: function() {
      Meteor.logout(function() {
        this.redirect("home");
      }.bind(this));
    },
    name: "logout"
  });
});


Tracker.autorun(function(stop) {
  if(Meteor.user()) Meteor.subscribe('my-orders');
});