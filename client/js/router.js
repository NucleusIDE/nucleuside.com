Router.configure({

});

Router.route("/dashboard", {
  waitOn: function() {
    // return Smuggler.load_templates_from_url( '/templates/test.html');
  },
  action: function() {
    this.render("dashboard");
  },
  name: "dashboard"
});

Router.route("/", {
  action: function() {
    this.render("landing");
  },
  name: "home"
});

Router.route("/login", {
  action: function() {
    this.render("login");
  },
  name: "login"
});

Router.route("/signup", {
  action: function() {
    this.redirect('login');
  },
  name: "signup"
});

Router.route("/logout", {
  action: function() {
    var self = this;
    Meteor.logout(function() {
      self.redirect("home");
    });
  },
  name: "logout"
});

Router.route("billing_wizard", {
  action: function() {
    this.render("billing_wizard");
  },
  name: "billing_wizard"
});

Router.route("/my-lab-sessions", {
  action: function() {
    this.render("lab_sessions");
  },
  name: "lab_sessions"
});

Router.route("/billing-history", {
  action: function() {
    this.render("billing_history");
  },
  name: "billing_history"
});

Router.route("/payment-details", {
  action: function() {
    this.render("payment_details");
  },
  name: "payment_details"
});
