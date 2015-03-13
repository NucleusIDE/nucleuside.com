Ultimate('NewInstanceTemplate').extends(UltimateTemplate, 'billing_option', {
	autorun: function() {
		console.log('YO', this.get('animal'));
	},
	subscribe: 'self',
	created: function() {
		this.autorun(function() {
			sub = this.subscribe('self');
			console.log('AUTORUN', this.get('animal'));
		});
		
		this.push("animal", 'cat');
	},
	dog: 'JAMES GILLMORE',
	test: function() {
		return this.get('animal')[0];
	},
	'click a': ['model', 'set', 'billing_method'],
	'click': function() {
		this.unshift('animal', 'dog');
	}
});
