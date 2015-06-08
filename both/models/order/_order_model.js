Ultimate('Order').extends(UltimateModel, {
  collection: 'orders',
  schema: {
    instance_id: {
      type: String,
    },
    user_id: {
      type: String,
    },
  },

  relations: {
    instance: {
      relation: 'belongs_to', 
      model: 'Instance',
      foreign_key: 'instance_id'
    }
  },

  defaults: function() {
    return {
      last_charged: new Date,
    };
  },


  displayAmount: function() {
    return Order.BILLING_METHODS[this.billing_method].display_amount;
  },
  runningCostFormatted: function() {
    return '$' + parseFloat(this.costToCharge()).toFixed(2);
  },
  

  isRunning: function() {
    return this.instance().isRunning();
  },
  orderIs: function(billingMethod) {
    return this.billing_method === billingMethod;
  }
}, {
  createOrder: function(billingMethod, instanceId) {
    var OrderClass = Order.BILLING_METHODS[billingMethod].class();
    return new OrderClass({instance_id: instanceId, user_id: Meteor.userId()}).save();
  }
});
