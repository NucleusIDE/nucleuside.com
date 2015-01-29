Order.extendClient({
	populateModel: function() {
		if($("#github-url").length === 0) return; 
		
	  this.github_url = $("#github-url").val().trim();
	  this.subdomain = $("#subdomain").val().trim();
	  this.password = $("#domain-passwd").val().trim();
	  this.billing_method = Session.get("billing_method").toLowerCase();
	},
	isValidOrder: function() {	
	  if(!this.github_url || !this.subdomain) return Flash.danger("Please fill all required fields.") || false;
	  if(this.subdomainUsed) return Flash.danger("The subdomain you provided is already in use") || false;
		
		if(!Utils.validate_url(this.github_url) || this.github_url.indexOf('github.com') === -1) {
	    Flash.danger("Invalid Github Url");
	    return false;
		}

	  Flash.clear();
	  return true;
	},
	createOrder: function() {
    BlockUI.block();
		this._createOrder(function(error, res) {
			BlockUI.unblock();
		
      if(error) Flash.danger(error.reason) && Session.set("billing_steps_done", 2);
      else Session.set("wizard_locked", true);
		});
	},
	setSubdomainUsage: function() {
		this.subdomainUsedAlready(this.subdomain, function(err, res) {
			if(res) {
				this.subdomainUsed = true;
				Flash.danger("The subdomain you provided is already in use"); //i wish i didnt have to do it again,
				Session.set("billing_steps_done", 2);//but it's if they click next b4 blur event callback updates this.subdomainUsed
			}
			else this.subdomainUsed = false;
		});
	}
});