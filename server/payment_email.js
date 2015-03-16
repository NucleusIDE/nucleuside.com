Ultimate('PaymentEmail').extends(UltimateEmail, {
	construct: function(payment) {
		this.payment = payment;
		this.order = this.payment.order();
		this.recipientEmail = this.payment.user().getEmail();
	},
  sendSuccess: function() {
    var from = "coder@ultimateide.com",
      to = this.recipientEmail,
      subject = "Invoice for your order on UltimateIDE.com",
      invoice = Meteor.absoluteUrl()  + "invoice/"+ this.payment._id,
      message = "Hey! \n Here's your invoice for your order #" + this.order._id + ": <a href='"+ invoice +" '>" + invoice + " </a>";

    this.send(from, to, subject, message);
  },
  sendFail: function() {
    var from = "coder@ultimateide.com",
      to = this.recipientEmail,
      subject = "Invoice for your order on UltimateIDE.com",
      invoice = Meteor.absoluteUrl()  + "invoice/"+ this.payment._id,
      message = "Hey! \n Here's we couldn't finish the payment for your order #" + this.order._id +" . We are shutting down your instance. Please visit http://www.ultimateide.com for re-enabling your nucleus instance. Here's your invoice for your order #" + this.order._id + ": <a href='"+ invoice +" '>" + invoice + " </a>";

    this.send(from, to, subject, message);
  }
});