StripeSubscription = function StripeSubscription(order) {
	this.order = order;
	this.customer_token = order.get_user().stripe_customer_token;
	this.plan_id = MasterConfig.stripe_plan_monthly();
	this.stripe_id = this.order.stripe_subscription_id; //only available on pre-existing orders, i.e. when they are canceled
};

StripeSubscription.extends(Stripe, {
  subscribe: function() {
    var res = this.create();
		
		console.log('RES', res);
		
    if (res.error) throw new Meteor.Error(res.error.name, res.error.message);
    else {
			this.order.plan = this.plan_id;
      this.order.current_plan_start = res.data.current_period_start;
      this.order.current_plan_end = res.data.current_period_end;
      this.order.stripe_subscription_id = res.data.id;
			this.order.save();
    }

    return this.order._id;
  },
	
	
	create: function() {
		return this._createSync(this.customer_token, {plan: this.plan_id});
	},
	update: function(options) {
		return this._updateSync(this.customer_token, this.stripe_id, options); //not used yet
	},
  cancel: function() {
		var res = this._cancelSync(this.customer_token, this.stripe_id);
		
    if (res.error) throw new Meteor.Error(res.error.name, res.error.message);
		else {
      console.log("Confirming Subscription Cancel:", res.data);
			this.order.canceled = true;
			this.order.hide = true;
			this.order.save();
		}
  },
	
	
	_createSync: function() {
		return this.applySync(this._stripe(), 'createSubscription', arguments);
	},
	_updateSync: function() {
		return this.applySync(this._stripe(), 'updateSubscription', arguments);
	},
	_cancelSync: function() {
		return this.applySync(this._stripe(), 'cancelSubscription', arguments);
	},
	_stripe: function() {
		return this.__stripe.customers;
	}
});