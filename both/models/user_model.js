/**
 * Attributes
 *
 * _has_valid_card             Boolean
 */

User = Model(Meteor.users);

User.extend({
  has_valid_card: function() {
    return !! this.valid_card;
  },
  get_email: function() {
    return this.emails[0].address;
  }
});
