Meteor.publish('self', function() {
  return Meteor.users.find({_id: this.userId}, {fields: {
    card_number: 1,
    valid_card: 1,
    emails: 1,
    profile: 1
  }});
});
