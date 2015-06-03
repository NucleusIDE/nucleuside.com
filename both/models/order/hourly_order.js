Ultimate('HourlyOrder').extends(Order, {
  schema: function() {
    return _.extend({}, this.callParent('schema'), {
      units_used: {
        type: Number,
      },
      last_charged: {
        type: Date,
      }
    });
  },


  defaults: function() {
    return _.extend({}, this.callParent('defaults'), {
      billing_method: 'hourly', 
      units_used: Order.BILLING_METHODS.hourly.min_units_used,
      cost_per_unit:  Order.BILLING_METHODS.hourly.cost_per_unit
    });
  },

  costToCharge: function() {
    return this.cost_per_unit * this.hoursUsed();
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