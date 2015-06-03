Ultimate('NewInstanceTemplate').extends(UltimateComponent, {
	template: 'billing_option',
	ar: function() {
		console.log('YO', this.get('animal'));
	},
	sub: ['self'],
	subLimit: ['something', {type: 1}, 10],
	onCreated: function() {
		this.push("animal", 'cat');
	},
	test: function() {
		return this.last('animal');
	},
	'click a': ['model', 'set', 'billing_method'],
	click: function() {
		console.log('CLICK MOFO')
		this.unshift('animal', 'dog');
	}
});
