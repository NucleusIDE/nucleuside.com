Blaze.registerHelper("session", function(key) {
  return Session.get(key);
});


Template.is_equal.helpers({
  yes: function(key, val) {
    return key === val;
  }
});
