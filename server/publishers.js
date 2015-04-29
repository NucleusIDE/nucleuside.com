Ultimate('Publish').extends(UltimatePublish, {
	roles: true,
	self: ['card_number', 'valid_card', 'emails', 'profile'],
	
	
	'my-instances': function() {
		if(!this.user()) return [];

		if(this.user().isAdmin()) return this._adminInstances();
	  else this._instances();
	},
	_adminInstances: function() {
		return Instances.find({hide: {$ne: true}});
	},
	_instances: function() {
		return Instances.find({user_id: this.userId, hide: {$ne: true}});
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