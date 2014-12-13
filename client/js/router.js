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
