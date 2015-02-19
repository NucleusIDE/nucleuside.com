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

  this.route("/billing-wizard", {
    onBeforeAction: function() {
      //Meteor.user().has_valid_card();
			//Flash.warning("You don't have a card on file. Please add a card first.");
			this.next();
    },
		data: function()  {
			return new Order({user_id: Meteor.userId()}); 
		},
    name: "billing_wizard"
  });

  this.route("/new-instance/:step", {
    name: "new_instance",
		data: function()  {
			return new Order({user_id: Meteor.userId(), billing_method: 'hourly'}); 
		}
  });
	
	
  this.route("/my-lab-sessions", {
		data: function() {
			return {orders: Orders.find()};
		},
    name: "lab_sessions"
  });

  this.route("/billing-history", {
    waitOn: function() {
      return Meteor.subscribe('my-payments');
    },
    name: "billing_history"
  });

  this.route("/payment-details", {
    name: "payment_details"
  });

  this.route("invoice", {
    path: "/invoice/:payment_id",
    waitOn: function() {
      return [Meteor.subscribe('my-payment', this.params.payment_id)];
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