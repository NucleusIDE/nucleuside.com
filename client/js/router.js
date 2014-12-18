var ir_helper_login_redirect_key = 'ir_helper_login_redirect_to',
    ir_helper_redirect_key = 'ir_helper_redirect_to',
    ir_helper_redirect_condition = function() {
      return false;
    },
    ir_helper_flash_key = "ir_helper_flash";

var come_back_from = function(route, options) {
  if(! this instanceof RouteController) return; //should execute this function only from within a RouteController

  Session.set(ir_helper_redirect_key, this.route.options.name);
  ir_helper_redirect_condition = options.condition;
  if(options.flash) {
    Session.set(ir_helper_flash_key, options.flash);
  }

  Router.go(route);
};

var require_login = function() {
  if(! this instanceof RouteController) return; //should execute this function only from within a RouteController

  if (! Meteor.userId()) {
    if(! Meteor.loggingIn()) {
      Router.go("login");
      Session.set(ir_helper_login_redirect_key, this.route.options.name);
    }
  } else this.next();
};

/**
 * Autorun to redirect user back to the previous route after logging in with require_login
 */
Tracker.autorun(function() {
  var login_redirect_route = Session.get(ir_helper_login_redirect_key),
      other_redirect_route = Session.get(ir_helper_redirect_key),  // we need these two keys because login_redirect_route gets executed every time
      // if we refresh page on a route. This is not a bug
      user = Meteor.user(),
      flash = Session.get(ir_helper_flash_key);

  if(login_redirect_route && user) {
    Router.go(login_redirect_route);
    Session.set(ir_helper_login_redirect_key, false);
  }

  if (user && other_redirect_route && ir_helper_redirect_condition()) {
    Router.go(other_redirect_route);
    Session.set(ir_helper_redirect_key, false);
    Flash.clear();
  }

  if (flash && typeof Flash !== 'undefined') {
    Flash[flash.action](flash.message);
  }
});

Router.configure({

});

Router.map(function() {
  this.route("dashboard", {
    path: "/dashboard",
    onBeforeAction: require_login,
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

      if (Meteor.user() && ! Meteor.user().has_valid_card()) {
        come_back_from.call(this, 'payment_details', {
          condition: function() {
            return Meteor.user().has_valid_card();
          },
          flash: {message: "You don't have a card on file. Please add a card first.", action: 'warning'}
        });
      }
    },
    action: function() {
      this.render("billing_wizard");
    },
    name: "billing_wizard"
  });

  this.route("/my-lab-sessions", {
    onBeforeAction: require_login,
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
    onBeforeAction: require_login,
    action: function() {
      this.render("payment_details");
    },
    name: "payment_details"
  });

});
