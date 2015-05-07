Ultimate('invoice').extends(UltimateComponent, {
  items: function() {
    return [{
      sno: 1,
      item: this.subdomain,
      desc: this.billing_method + " instance of Nucleus IDE",
      qty: this.units_used,
      ppu: this.cost_per_unit,
      total: this.amount
    }];
  },
  total: function() {
    return "$ " + this.amount;
  }
});
