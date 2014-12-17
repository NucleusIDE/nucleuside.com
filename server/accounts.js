Accounts.onCreateUser(function(options, user) {
  if (user.services.github) {
    user.emails = [
      {
        "address": user.services.github.email,
        "verfied": true
      }
    ];
  }

  return user;
});
