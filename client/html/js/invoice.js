var payment, total_cost = 0;

Template.invoice.helpers({
  payment: function() {
    payment = Payments.findOne(this.payment_id);
    return payment;
  },
  buyer: function() {
    var buyer = payment.user();
    return buyer;
  },
  items: function() {
    var count = 1;
    total_cost = payment.get_amount();
    return [{
      sno: count,
      item: payment.get_subdomain(),
      desc: payment.order_billing_method + " instance of Nucleus IDE",
      qty: payment.get_units_used(),
      ppu: payment.get_cost_per_unit(),
      total: payment.get_amount()
    }];
  },
  total: function() {
    return "$ " + total_cost;
  }
});
