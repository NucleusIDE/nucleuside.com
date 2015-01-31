Template.header.events({
  "click #login-with-github": function(e) {
    e.preventDefault();
		
    Meteor.loginWithGithub({
      requestPermissions: ['user']
    },function(err) {
      console.log(arguments);
    });
  }
});