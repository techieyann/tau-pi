var scrub = function (word) {
	return word.replace(/[0123456789_\W]/g, '');
};

Template.words.rendered = function () {
	this.autorun(function () {
		var temp = Template.currentData();
		$('[data-toggle=tooltip]').tooltip();
	});
};
Template.words.helpers({
	words: function () {
		if (this) {
			return this;
		}
	},
	pageNum: function () {
		return Session.get("pageNum");
	},
	prevPage: function () {
		var pageNum = Session.get("pageNum");
		var status = Session.get("status");
		if (status) {
			if ((pageNum+1) <= Math.ceil(status.wordNum/NUM_WORDS)) return pageNum+1;
		}
		return 0;
	},
	nextPage: function () {
		var pageNum = Session.get("pageNum");
		return pageNum - 1;
	},
	firstDate: function () {
		if (this) {
			if (this.count()) {
			var formatStr = 'h:mm:ss a';
			var that = this.fetch();
			var firstTime = that[0].time;
			var lastTime = that[that.length-1].time;
			var firstDay = moment(firstTime).format('YYYY-MM-DD');
			var lastDay = moment(lastTime).format('YYYY-MM-DD');

			if (moment(lastDay).diff(firstDay, 'days')) formatStr = 'MM/D/YY - ' + formatStr;
			return moment(firstTime).format(formatStr);
			}
		}

	},
	lastDate: function () {

		if (this) {
			if (this.count()) {
				var formatStr = 'h:mm:ss a';
				var that = this.fetch();
				var firstTime = that[0].time;
				var lastTime = that[that.length-1].time;
				var firstDay = moment(firstTime).format('YYYY-MM-DD');
				var lastDay = moment(lastTime).format('YYYY-MM-DD');
				if (moment(lastDay).diff(firstDay, 'days')) formatStr = 'MM/D/YY - '+ formatStr ;
				return moment(lastTime).format(formatStr);
			}
		}

	},
	moment: function () {
		return moment(this.time).format('h:mm:ss a - MMMM Do, YYYY');
	},
	progressStyle: function () {
		var status = Session.get('status');
		if (status) {
			var pvs = pvStatus.findOne({statusId: status._id});
			if (pvs.percent == 100) {
				if (pvs.votes == 0) {
					return 'progress-bar-warning';
				}
				return 'progress-bar-success';
			}
		}
	},
	percent: function () {
		var status = Session.get('status');
		if (status) {
			var pvs = pvStatus.findOne({statusId: status._id});
			if (pvs) return pvs.percent;
		}
		return 0;
	},
	newVotes: function () {
		var status = Session.get('status');
		if (status) {
			var pvs = pvStatus.findOne({statusId: status._id});
			if (pvs) return pvs.votes;
		}
		return 0;
	},
	pluralizeVote: function () {
		var status = Session.get('status');
		if (status) {
			var pvs = pvStatus.findOne({statusId: status._id});
			if (pvs) return (pvs.votes == 1? '':'s');
		}
}
	});

Template.wordInput.helpers({
	voting: function () {
		var status = Session.get('status');
		if (status) {
			if (status.voting) {
				return true;
			}
		}
		return false;
	},
	newVote: function () {
		if (Meteor.user()) {
			var status = Session.get('status');
			if (status) {
				var votes = Votes.find({number: status.wordNum}, {sort: {time: -1}, limit: 5});
				if (votes.count()) return Votes.find({number: status.wordNum}, {sort: {time: -1}, limit: 5});
				return 0;
			}
		}
	},
	currentVote: function () {
		var status = Session.get('status');
		if (status) {
			var vote = Votes.findOne({$and: [{number: status.wordNum}, {member: Meteor.user()._id}]});
			if (vote) return vote.word;
			return 'next word...';
		}
	},
	numWordsWon: function () {
		if (Meteor.user()) {
			if (Meteor.user().profile) return Meteor.user().profile.winningWords;
		}
	},
	focus: function () {
		Meteor.setTimeout(function () {$('#new-word').focus();}, 200);
	}
});

var nonoList = [
	'arse',
	'ass',
	'asshole',
	'bastard',
	'bitch',
	'bollocks',
	'cunt',
	'damn',
	'fuck',
	'goddamn',
	'motherfucker',
	'shit',
	'nigger',
	'kike',
	'chink',
	'jap',
	'spic'
];

var censored = function (word) {
	if (nonoList.indexOf(word.toLowerCase()) != -1) return true;
	return false;
};

Template.wordInput.events = {
	'submit #new-word-form, click #new-word-submit': function (e) {
		e.preventDefault();
		var status = Session.get('status');
		if (status.voting) {
			var newWord = $('#new-word').val();
			if (newWord.indexOf(' ') != -1) {
				alert('warning', 'Please only one word');
				$('#new-word').val('');
				$('#new-word').focus();
				return;
			}
			newWord = scrub(newWord);
			if (newWord == '') {
				alert('warning', 'Please input a word');
				$('#new-word').val('');
				$('#new-word').focus();
				return;
			}
			if (censored(newWord)) {
				alert('warning', 'The word "'+newWord+'" is not allowed');
				$('#new-word').val('');
				$('#new-word').focus();
				return;
			}
			Meteor.call('voteWord', newWord, function (err) {
				if (err) {
					alert('danger', 'Voting Error: '+err.message);
					return;
				}
				Session.set("currentVote", newWord);
				$('#new-word').val('');
				$('#new-word').focus();
			});
		}
		else alert('warning', 'Currently tabulating votes, please wait.');
	}
};

Template.backToVoting.events = {
	'click #back-to-voting': function (e) {
		Router.go('/');
	}
};
