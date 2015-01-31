Router.configure({});
Router.setTemplateNameConverter(function (str) { return str; });

Tracker.autorun(function(stop) {
  //if (!Router.current()) return;
  //var current_route = Router.current().route.options.name;
  if(Meteor.user()) Router.go("lab_sessions");
});


Router.map(function() {
  this.route("/", {
    name: "landing"
  });

  this.route("/logout", {
    action: function() {
      Meteor.logout(function() {
        this.redirect("home");
      }.bind(this));
    },
    name: "logout"
  });

  this.route("/billing-wizard", {
    onBeforeAction: function() {
      //Meteor.user().has_valid_card();
			//Flash.warning("You don't have a card on file. Please add a card first.");
    },
		data: function()  {
			return new Order({user_id: Meteor.userId()}); 
		},
    name: "billing_wizard"
  });

  this.route("/my-lab-sessions", {
    waitOn: function() {
      return Meteor.subscribe('my-orders');
    },
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
});
