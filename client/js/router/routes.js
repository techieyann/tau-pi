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
					var currentPage = parseInt(query.page);
					Session.set('pageNum', currentPage);
					if (currentPage  <= Math.floor(status.wordNum/NUM_WORDS)) {
						var limitWords = NUM_WORDS;
						var skipWords = NUM_WORDS*(currentPage-1);
						if (skipWords < 0) {
							limitWords = limitWords + skipWords;
							skipWords = 0;
						}
						return Words.find({}, {skip: skipWords, limit: limitWords});
					}
					else Router.go('/');
				}
				else {
					var currentPage = Math.ceil(status.wordNum/NUM_WORDS);
					var previousWords = 0;
					if (currentPage == ((status.wordNum-1)/NUM_WORDS)+1) previousWords = 10;
					Session.set('pageNum', currentPage);
					if (status.wordNum > NUM_WORDS) {
						var filter = {
							skip: (NUM_WORDS*(currentPage-1))-previousWords
						};
						return Words.find({}, filter);				
					}
					return Words.find();
				}
			}
		}
	});
});
