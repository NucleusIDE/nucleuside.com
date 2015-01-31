Template.invoice.helpers({
  items: function() {
    return [{
      sno: 1,
      item: this.get_subdomain(),
      desc: this.order_billing_method + " instance of Nucleus IDE",
      qty: this.get_units_used(),
      ppu: this.get_cost_per_unit(),
      total: this.get_amount()
    }];
  },
  total: function() {
    return "$ " + this.get_amount();
  }
});
