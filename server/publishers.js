Ultimate('Publish').extends(UltimatePublish, {
	roles: true,
	self: {card_number: 1, valid_card: 1, emails: 1, profile: 1},
	
	
	'my-orders': function() {
		if(!this.user()) return [];
	
		if(this.user().isAdmin()) return this._adminOrders();
	  else this._orders();
	},
	_adminOrders: function() {
		if(this.user().isAdmin()) return Orders.find({hide: {$ne: true}});
	},
	_orders: function() {
		return Orders.find({user_id: this.userId, hide: {$ne: true}});
	},
	
	
	'my-order': function(orderId) {
		return Orders.find({_id: orderId});
	},
	'my-payment': function(paymentId) {
	  return Payments.find({_id: paymentId});
	},
	'my-payments': function() {
		return Payments.find({user_id: this.userId});
	}
});