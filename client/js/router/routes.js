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
				if (status.wordNum > 30) {
					return Words.find({}, {skip: status.wordNum-30, limit: 30});				
				}
				return Words.find();				
			}
		}
	});
});
