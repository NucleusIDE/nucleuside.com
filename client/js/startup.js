Meteor.startup(function() {
  Stripe.setPublishableKey(MasterConfig.keys.stripe);
});
