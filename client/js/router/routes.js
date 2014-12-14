var NUM_WORDS = 60;
Router.map(function () {

	this.route('welcome', {
		path: '/',
		controller: 'BaseController',
		subscriptions: function () {
			this.wait(Meteor.subscribe('status'));
			this.wait(Meteor.subscribe('words'));
			this.wait(Meteor.subscribe('votes'));
		},
		data: function () {
			var status = Status.findOne();
			if (status) {
				if (status.wordNum > NUM_WORDS) {
					return Words.find({}, {skip: status.wordNum-NUM_WORDS, limit: NUM_WORDS});				
				}
				return Words.find();				
			}
		}
	});
});
