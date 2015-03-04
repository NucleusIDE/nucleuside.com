Orders.allow({
  insert: function(userId, doc) {
    //we create orders on server only
    return true;
  },
  update: function(userId, doc, fields, modifier) {
    return false;
    //for now we don't let user change any field
    if (_.contains(fields, "start_date")) {
      //don't let users update the start_date of order
      return false;
    }
    if (_.contains(fields, "units_used")) {
      //don't let users update the units_used so far
      return false;
    }
    if (_.contains(fields, "billing_method")) {
      //let's not let user change the billing method for now. At some point we may want to allow users to update the billing method, but not now
      return false;
    }
  },
  remove: function(userId, doc) {
    return doc.user_id === userId;
  },
  fetch: ['user_id']
});
