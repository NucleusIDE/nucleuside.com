Accounts.onCreateUser(function(options, user) {
  if (user.services.github) {
    user.emails = [
      {
        "address": user.services.github.email,
        "verfied": true
      }
    ];
  }

  if(_.contains(MasterConfig.admins.emails, user.emails[0]['address'])) {
    user.roles = ['admin'];
  } else {
    user.roles = ['user'];
  }

  return user;
});
