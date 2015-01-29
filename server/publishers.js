/**
 * Roles are not published by default
 */
Meteor.publish(null, function (){
  return Meteor.roles.find({});
});

Meteor.publish('self', function() {
  return Meteor.users.find({_id: this.userId}, {fields: {
    card_number: 1,
    valid_card: 1,
    emails: 1,
    profile: 1
  }});
});

Meteor.publish("my-orders", function() {
	var user = Meteor.users.findOne(this.userId);
	
	if(user.is_admin()) return Orders.find();
  else Orders.find({user_id: this.userId});
});

Meteor.publish("my-order", function(order_id) {
  return Orders.find({_id: order_id});
});

Meteor.publish("my-payment", function(payment_id) {
  var payment = Payments.find({_id: payment_id});
  return payment;
});

Meteor.publish("my-payments", function() {
  return Payments.find({user_id: this.userId});
});
