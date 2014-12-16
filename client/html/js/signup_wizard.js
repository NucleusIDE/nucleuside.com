Template.signup_wizard.rendered = function() {
  $("#wizard > ul > li:first-child > a").click();
  $("select").select2();
};


Template.signup_wizard.events({
  "click .step-1": function() {
    Session.set("signup_steps_done", 1);
  },
  "click .step-2": function() {
    Session.set("signup_steps_done", 2);
  },
  "click .step-3": function() {
    Session.set("signup_steps_done", 3);
  },
  "click .step-4": function() {
    Session.set("signup_steps_done", 4);
  }
});

/**
 * Autorun to update the progress bar below the signup form
 */
Tracker.autorun(function() {
  var signup_steps_done = Session.get("signup_steps_done"),
      $progress_bar = $(".progress-bar-inverse");

  console.log("SIGNUP", signup_steps_done);

  switch(signup_steps_done) {
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
