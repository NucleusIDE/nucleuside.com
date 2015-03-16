Ultimate('OrderCharge').extends(Order, 'orders', {
	displayAmount: function() {
		return '$1 / hour used';
	},
	
	
  costToCharge: function() {
    eturn this.cost_per_unit * this.hoursUsed();
  },
	hoursUsed: function() {
		var mom = this.terminated_at ? moment(this.terminated_at) : moment();
		return mom.diff(this.last_charged, 'hours');  
	},
	
  reset: function() { //Reset order after a successful charge
    this.update({last_charged: moment().toDate()});
  },
	deactivate: function() {
		this.user().update({valid_card: false}); 
	}
});