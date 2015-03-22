Ultimate('PaymentEmail').extends(UltimateEmail, {
	from: "coder@ultimateide.com",
	construct: function(payment) {
		this.payment = payment;
		this.order = this.payment.order();
		this.recipientEmail = this.payment.user().getEmail();
	},
  sendSuccess: function() {
    var to = this.recipientEmail,
      subject = "Invoice for your order on UltimateIDE.com",
      invoice = Meteor.absoluteUrl()  + "invoice/"+ this.payment._id,
      message = "Hey! \n Here's your invoice for your order #" + this.order._id + ": <a href='"+ invoice +" '>" + invoice + " </a>";

    this.send(from, to, subject, message);
  },
  sendFail: function() {
    var to = this.recipientEmail,
      subject = "Credit Card Deflined on UltimateIDE.com",
      paymentInfoUrl = Meteor.absoluteUrl()  + "payment-info/",
			message = 'Hey \n your credit card was declined on Ultimate IDE.com. Please visit <a href="'+paymentInfoUrl+'">'+paymentInfoUrl+'</a> to change it. It will be tried again on :'+this.formattedDate('next_attempt')+'.';

    this.send(this.from, to, subject, message);
  }
});