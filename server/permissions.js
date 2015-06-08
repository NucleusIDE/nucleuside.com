Ultimate('OrderPermissions').extends(UltimatePermissions, {
  insert: function(userId, doc) {
    return false;
  },
  update: function(userId, doc, fields, modifier) {
    return false;
		return _.containsSome(fields, ['billing_method', 'units_used', 'start_date']);
  },
  remove: function(userId, doc) {
    return true;
    return doc.user_id === userId;
  },
  fetch: ['user_id']
});


Ultimate('InstancePermissions').extends(UltimatePermissions, {
  insert: function(userId, doc) {
    return true;
  },
  update: function(userId, doc, fields, modifier) {
    return true;
  },
  remove: function(userId, doc) {
    return true;
    return doc.user_id === userId;
  },
  fetch: ['user_id']
});


Ultimate('PaymentPermissions').extends(UltimatePermissions, {
  insert: function(userId, doc) {
    return true;
  },
  update: function(userId, doc, fields, modifier) {
    return true;
  },
  remove: function(userId, doc) {
    return true;
    return doc.user_id === userId;
  },
  fetch: ['user_id']
});