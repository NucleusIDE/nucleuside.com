Template.billing_wizard.rendered = function() {
	Session.set("billing_method", 'hourly');
	Session.set("wizard_locked", false);
	$("select").select2();
	
	
	/**
	 * Redirect Flow + create_order on flow completion
	 */
	this.autorun(function() {
		if (Session.get("wizard_locked")) return;
		
		var steps_done = Session.get("billing_steps_done"),
		order = Template.currentData();
		console.log('ROUTER', order);
		order.populateModel();

	  if(steps_done == 3 && !order.isValidOrder()) return Session.set("billing_steps_done", 2);

	  if(steps_done == 4) order.createOrder();
	});



	/**
	 * Autorun to update the progress bar width below the signup form
	 */
	this.autorun(function() {
		var steps_done = Session.get("billing_steps_done");
		$(".progress-bar-inverse").width((steps_done * 25) + '%');
	});
};


Template.billing_wizard.events({
	"blur #subdomain": function() {
		var order = Template.currentData();
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
    return Template.currentData();
  }
});

Template.billing_option.helpers({
	selected: function(cycle) {
		if(cycle == 'hourly') return Session.get('billing_method') == 'hourly' ? 'btn-primary' : 'btn-transparent';
		else if(cycle == 'monthly') return Session.get('billing_method') == 'monthly' ? 'btn-primary' : 'btn-transparent';
	}
});
