NUM_WORDS = 60;

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
			var query = this.params.query;
			if (status) {
				if (query.page) {
					var pageNum = parseInt(query.page);
					Session.set('pageNum', pageNum);
					if (pageNum  <= Math.ceil(status.wordNum/NUM_WORDS)) {
						var limitWords = NUM_WORDS;
						var skipWords = status.wordNum-(NUM_WORDS*pageNum);
						if (skipWords < 0) {
							limitWords = limitWords + skipWords;
							skipWords = 0;
						}
						return Words.find({}, {skip: skipWords, limit: limitWords});
					}
					else Router.go('/');
				}
				else Session.set('pageNum', 1);
				if (status.wordNum > NUM_WORDS) {
					return Words.find({}, {skip: status.wordNum-NUM_WORDS, limit: NUM_WORDS});				
				}
				return Words.find();
			}
		}
	});
});
