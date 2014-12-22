Template.invoice.helpers({
  order: function() {
    return Orders.findOne(this.order_id);
  }
});
