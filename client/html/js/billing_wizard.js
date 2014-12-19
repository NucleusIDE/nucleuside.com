var order = {};

var valid_order = function() {
  if (! document.getElementById("github-url")) return !!order.github_url;

  order.github_url = $("#github-url").val().trim(),
  order.subdomain = $("#subdomain").val().trim(),
  order.password = $("#domain-passwd").val().trim(),
  order.billing_method = Session.get("billing_method");
  order.display_amount = order.billing_method === 'Monthly' ? '$160 / Month' : '$1 / hour used';

  if (!order.github_url || !order.subdomain || !order.billing_method) {
    Flash.danger("Invalid Order");
    return false;
  }

  if (!Utils.validate_url(order.github_url)) {
    Flash.danger("Invalid git url");
    return false;
  }

  Flash.clear();
  return true;
};

Template.billing_wizard.rendered = function() {
  var $progress_bar = $(".progress-bar-inverse");
  $("select").select2();
  $progress_bar.width("25%");
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
  },
  "click .next > button": function() {
    var steps_done = Session.get("billing_steps_done");
    steps_done === 4 ?
      Session.set("billing_steps_done", 4) :
      Session.set("billing_steps_done", steps_done + 1);
  },
  "click .previous > button": function() {
    var steps_done = Session.get("billing_steps_done");
    steps_done === 1 ?
      Session.set("billing_steps_done", 1) :
      Session.set("billing_steps_done", steps_done - 1);
  },
  "click .hourly": function(e) {
    e.preventDefault();
    $(e.currentTarget).addClass('btn-primary').removeClass('btn-transparent');
    $(".monthly").removeClass('btn-primary').addClass('btn-transparent');
    Session.set("billing_method", 'Hourly');
  },
  "click .monthly": function(e) {
    e.preventDefault();
    $(e.currentTarget).addClass('btn-primary').removeClass('btn-transparent');
    $(".hourly").removeClass('btn-primary').addClass('btn-transparent');
    Session.set("billing_method", 'Monthly');
  }
});

Template.billing_wizard.helpers({
  "cant_go_previous": function() {
    return Session.get("billing_steps_done") === 1 || Session.get("wizard_locked");
  },
  "cant_go_next": function() {
    return Session.get("billing_steps_done") === 4;
  },
  steps_done: function() {
    return Session.get("billing_steps_done");
  },
  order: function() {
    return order;
  },

});

/**
 * Autorun to update the progress bar below the signup form
 */
Tracker.autorun(function() {
  var steps_done = Session.get("billing_steps_done"),
      $progress_bar = $(".progress-bar-inverse");

  if (Session.get("wizard_locked")) {
    Session.set("billing_steps_done", 4);
    steps_done = 4;
    return;
  }

  if (steps_done > 2) {
    if (!valid_order()) {
      Session.set("billing_steps_done", 2);
      return;
    }
  }

  if (steps_done == 4) {
    BlockUI.block();
    Meteor.call('create_order', {
      billing_method: order.billing_method.toLowerCase(),
      github_url: order.github_url,
      subdomain: order.subdomain,
      password: order.password
    }, function(err, res) {
      BlockUI.unblock();
      if (err) {
        Flash.danger(err.message);
        Session.set("billing_steps_done", 2);
        return false;
      }
      order = {};
      Session.set("wizard_locked", true);
    });
  }

  //set width of progress bar
  switch (steps_done) {
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
