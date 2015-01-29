Template.payment_details.rendered = function() {
  $("#expiry").datetimepicker();
  $("select").select2();
};

Template.payment_details.helpers({
  expiry_year: function() {
    var years = _.map(_.range(moment().year(), 2022), function(y) {
      return {year: y};
    });
    return years;
  },
	current_card: function() {
		return Meteor.user() && Meteor.user().card_number;
	}
});

Template.payment_details.events({
  "submit #payment-details-form": function(e) {
    e.preventDefault();

    var card = {
      number: $("#credit").val().replace(/ /g, ''),
      cvc: $("#cvc").val(),
      expMonth: $("#expiry-month").val(),
      expYear: $("#expiry-year").val()
    };
		var last4 = card.number.slice(-4);
		
    if(!card.number || !card.cvc) return Flash.danger("Please fill all fields");
    if(card.card.length !== 16) return Flash.danger("Invalid Card");
    if(card.cvc.length > 3) return Flash.danger("CVC can't be more than 3 characters in length");
    if(!_.isNumber(parseInt(card.number)) || !_.isNumber(parseInt(card.cvc))) return Flash.danger("Card Number and CVC should only be numbers.");

    Meteor.user().add_new_card(card, last4);
  }
});
