Router.configure({

});

var require_login = function() {
  if(! this instanceof RouteController) return; //should execute this function only from within a RouteController

  if (! Meteor.userId()) {
    if(! Meteor.loggingIn()) {
      this.redirect("login");
      Session.set("rl_redirect_back_to", this.route.options.name);
    }
  }
};

/**
 * Autorun to redirect user back to the previous route after logging in with require_login
 */
Tracker.autorun(function() {
  var redirect_route = Session.get("rl_redirect_back_to"),
      user = Meteor.user();

  if(redirect_route && user) {
    Router.go(redirect_route);
    Session.set("rl_redirect_back_to", false);
  }
});

Router.map(function() {
  this.route("dashboard", {
    path: "/dashboard",
    waitOn: function() {
      // return Smuggler.load_templates_from_url( '/templates/test.html');
    },
    action: function() {
      this.render("dashboard");
    }
  });

  this.route("/", {
    action: function() {
      this.render("landing");
    },
    name: "home"
  });

  this.route("/login", {
    onBefore: function() {
      //we handle redirection to appropriate page on login with github in login.js in an autorun
    },
    action: function() {
      Session.set("is_signing_up", false);
      this.render("login");
    },
    name: "login"
  });

  this.route("/signup", {
    onBefore: function() {
      //we handle redirection to appropriate page on login with github in login.js in an autorun
    },
    action: function() {
      Session.set("is_signing_up", true);
      this.render("login");
    },
    name: "signup"
  });

  this.route("/logout", {
    action: function() {
      var self = this;
      Meteor.logout(function() {
        self.redirect("home");
      });
    },
    name: "logout"
  });

  this.route("/billing-wizard", {
    onBeforeAction: function() {
      require_login.call(this);
      Session.set("billing_steps_done", 1);
      Session.set("billing_method", 'hourly');

      this.next();
    },
    action: function() {
      this.render("billing_wizard");
    },
    name: "billing_wizard"
  });

  this.route("/my-lab-sessions", {
    action: function() {
      this.render("lab_sessions");
    },
    name: "lab_sessions"
  });

  this.route("/billing-history", {
    onBeforeAction: require_login,
    action: function() {
      this.render("billing_history");
    },
    name: "billing_history"
  });

  this.route("/payment-details", {
    action: function() {
      this.render("payment_details");
    },
    name: "payment_details"
  });

});
