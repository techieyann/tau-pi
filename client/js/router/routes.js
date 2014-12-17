var NUM_WORDS = 60;
var NUM_WORDS_PER_PAGE = 1024;
Router.map(function () {

	this.route('welcome', {
		path: '/',
		controller: 'BaseController',
		subscriptions: function () {
			this.wait(Meteor.subscribe('status'));
			this.wait(Meteor.subscribe('percent-votes'));
			this.wait(Meteor.subscribe('words'));
			this.wait(Meteor.subscribe('votes'));
		},
		data: function () {
			Session.set('status', Status.findOne());
			var status = Session.get('status');
			if (status) {
				if (status.wordNum > NUM_WORDS) {
					Session.set('earlier', true);
					return Words.find({}, {skip: status.wordNum-NUM_WORDS, limit: NUM_WORDS});				
				}
				return Words.find();
			}
		}
	});
	this.route('history', {
		path: '/history',
		controller: 'BaseController',
		subscriptions: function () {
			this.wait(Meteor.subscribe('status'));
			this.wait(Meteor.subscribe('words'));
		},
		data: function () {
			Session.set('status', Status.findOne());
			var status = Session.get('status');

			if (status) {
				skipWords = 0;
				var limitWords = status.wordNum-NUM_WORDS;
				return Words.find({}, {skip: skipWords, limit: limitWords});
			}
		}
	});
});
