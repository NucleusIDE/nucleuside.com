Template.login.helpers({

});

Template.login.events({
  "submit #login-form": function(e) {
    e.preventDefault();

    var email = $("#email").val().trim(),
        password = $("#password").val().trim(),
        is_signing_up = Session.get("is_signing_up");

    if(! email || ! password) {
      Flash.danger("Please enter both email and password");
      return false;
    }

    if(! Utils.validate_email(email)) {
      Flash.danger("Invalid Email");
      return false;
    }


    if (is_signing_up) {
      var confirm_password = $("#confirm-password").val().trim();

      if(! confirm_password) {
        Flash.danger("Please confirm your password");
      }

      if (password !== confirm_password) {
        Flash.danger("Passwords doesn't match");
        return false;
      }

      Accounts.createUser({
        email: email,
        password: password
      }, function(err) {
        if (err) {
          Flash.danger("Account creation failed. " + err.message );
          return false;
        }
        Router.go("lab_sessions");
      });
    } else {
      Meteor.loginWithPassword(email, password, function(err) {
        if (err) {
          Flash.danger("Login Failed.");
          return false;
        }
        Router.go("lab_sessions");
      });
    }
  },
  "click #login-with-github": function(e) {
    e.preventDefault();
    Meteor.loginWithGithub({
      requestPermissions: ['user']
    },function(err) {
      console.log(arguments);
    });
  }
});

/**
 * Autorun to redirect users from login page to lab sessions page if user is logged in already. This is because Router.onBefore isn't working when logging in with github
 */
Tracker.autorun(function(stop) {
  if (!Router.current()) {
    return;
  }
  var current_route = Router.current().route.options.name;
  if ((current_route == 'login' || current_route == 'signup') && Meteor.user()) {
    Router.go("lab_sessions");
  }
});
