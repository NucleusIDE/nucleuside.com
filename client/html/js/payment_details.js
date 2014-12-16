Template.payment_details.rendered = function() {
  $("#expiry").datetimepicker();
  $("select").select2();
};

Template.payment_details.helpers({
  expiry_year: function() {
    var years = _.map(_.range(moment().year(), 2040), function(y) {
      return {year: y};
    });
    return years;
  }
});

Template.payment_details.events({
  "submit #payment-details-form": function(e) {
    e.preventDefault();

    var form = $("#payment-details-form"),
        name = $("#name").val().trim(),
        card = $("#credit").val().trim(),
        expiry_month = $("#expiry-month").val(),
        expiry_year = $("#expiry-year").val(),
        cvc = $("#cvc").val();

    if (! name || ! card || ! cvc) {
      Flash.danger("Please fill all fields");
      return false;
    }

    if (cvc.length > 3) {
      Flash.danger("CVC can't be more than 3 character in length");
      return false;
    }
    if (card.length !== 16) {
      Flash.danger("Invalid Card");
      return false;
    }

    card =  parseInt(card);
    cvc =  parseInt(cvc);

    if (!_.isNumber(card) || !_.isNumber(cvc) ) {
      Flash.danger("Card Number and CVC should be integers.");
      return false;
    }



    var stripe_card = {
      number: card,
      cvc: cvc,
      expMonth: expiry_month,
      expYear: expiry_year
    };

    BlockUI.block();
    Stripe.createToken(stripe_card, function(status, response) {
      if(status === 200) {
        if(!Meteor.user()) { alert("No user"); return false;}
        var stripeCardToken = response.id;
        var last4CardNumber = (""+card).slice(-4);

        Meteor.call('update_billing_info', stripeCardToken, last4CardNumber, function(error, result) {
          BlockUI.unblock();
          if (error) {
            Flash.danger('Something is wrong with the card you provided. Please double check it.');
            return false;
          }
          Flash.success("Payment info updated! :)");
          form[0].reset();
        });
      }
      else {
        BlockUI.unblock();
        Flash.danger('Something is wrong with the card you provided. Please double check it.');
        console.log(response);
      }
    });
  }
});
