var order;

Meteor.startup(function() {
	order = new Order;
});

Template.billing_wizard.rendered = function() {
  var $progress_bar = $(".progress-bar-inverse");
  $progress_bar.width("25%");
	
	$("select").select2();
	
	order = new Order;
	Session.set("billing_method", 'hourly');
	Session.set("wizard_locked", false);
};


Template.billing_wizard.events({
	"blur #subdomain": function() {
		order.subdomain = $("#subdomain").val().trim();
		order.setSubdomainUsage();
	},
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
		if(steps_done < 4) Session.set("billing_steps_done", steps_done + 1);
  },
  "click .previous > button": function() {
    var steps_done = Session.get("billing_steps_done");
		if(steps_done > 1) Session.set("billing_steps_done", steps_done - 1);
  },
  "click .hourly": function(e) {
		e.preventDefault();
    Session.set("billing_method", 'hourly');
  },
  "click .monthly": function(e) {
		e.preventDefault();
    Session.set("billing_method", 'monthly');
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
  }
});

Template.billing_option.helpers({
	selected: function(cycle) {
		if(cycle == 'hourly') return Session.get('billing_method') == 'hourly' ? 'btn-primary' : 'btn-transparent';
		else if(cycle == 'monthly') return Session.get('billing_method') == 'monthly' ? 'btn-primary' : 'btn-transparent';
	}
});

/**
 * Redirect Flow + create_order on flow completion
 */
Tracker.autorun(function() {
	if (Session.get("wizard_locked")) return;
		
	var steps_done = Session.get("billing_steps_done");

  if (steps_done == 3) {
		order.populateModel();
		
		if(!order.isValidOrder()) return Session.set("billing_steps_done", 2);
  }

  if (steps_done == 4) {
    BlockUI.block();
		
    Meteor.call('create_order', order, function(err, res) {
      BlockUI.unblock();
			
      if (err) {
        Flash.danger(err.message);
        Session.set("billing_steps_done", 2);
      }
      else Session.set("wizard_locked", true);
    });
  }
});



/**
 * Autorun to update the progress bar width below the signup form
 */
Tracker.autorun(function() {
	var steps_done = Session.get("billing_steps_done"),
		$progress_bar = $(".progress-bar-inverse");
		
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
