var send_email = function(from, to, subject, message) {
  Email.send({
    from: from,
    to: to,
    subject: subject,
    html: message
  });
};

Meteor.methods({
  send_invoice_email: function(payment_id) {
    var payment = Payments.findOne(payment_id),
        order = payment.get_order();

    var from = "orders@nucleuside.com",
        to = payment.user().getEmail(),
        subject = "Invoice for your order on NucleusIDE.com",
        invoice = Meteor.absoluteUrl()  + "invoice/"+ payment._id,
        message = "Hey! \n Here's your invoice for your order #" + order()._id + ": <a href='"+ invoice +" '>" + invoice + " </a>";

    send_email(from, to, subject, message);
  },
  send_payment_failed_email: function(order_id) {
    var payment = Payments.findOne(payment_id),
        order = payment.get_order();

    var from = "orders@nucleuside.com",
        to = payment.user().getEmail(),
        subject = "Invoice for your order on NucleusIDE.com",
        invoice = Meteor.absoluteUrl()  + "invoice/"+ payment._id,
        message = "Hey! \n Here's we couldn't finish the payment for your order #" + order._id +" . We are shutting down your instance. Please visit http://nucleuside.com for re-enabling your nucleus instance. Here's your invoice for your order #" + order()._id + ": <a href='"+ invoice +" '>" + invoice + " </a>";

    send_email(from, to, subject, message);
  }
});
