Template.billing_wizard.rendered = function() {
  $("#wizard > ul > li:first-child > a").click();
  $("select").select2();
};


Template.billing_wizard.events({
  "click .step-1": function() {
    Session.set("billing_steps_done", 1);
  },
  "click .step-2": function() {
    Session.set("billing_steps_done", 2);
  },
  "click .step-3": function() {
    Session.set("billing_steps_done", 3);
  },
  "click .step-4": function() {
    Session.set("billing_steps_done", 4);
  }
});

Template.billing_wizard.helpers({
  "can_go_previous": function() {
    return Session.get("billing_steps_done") > 1;
  },
  "can_go_forward": function() {
    return Session.get("billing_steps_done") < 4;
  }
});

/**
 * Autorun to update the progress bar below the signup form
 */
Tracker.autorun(function() {
  var billing_steps_done = Session.get("billing_steps_done"),
      $progress_bar = $(".progress-bar-inverse");

  switch(billing_steps_done) {
  case 1:
    $progress_bar.width("25%");
    break;
  case 2:
    $progress_bar.width("50%");
    break;
  case 3:
    $progress_bar.width("75%");
    break;
  case 4:
    $progress_bar.width("100%");
    break;
  }

});
