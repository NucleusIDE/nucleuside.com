Template.login.rendered = function() {
  if(Meteor.userId())
    Router.go("lab_sessions");
};

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
  }
});
