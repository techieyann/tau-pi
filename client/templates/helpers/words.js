var scrub = function (word) {
	return word.replace(/[0123456789_\W]/g, '');
};
Template.words.rendered = function () {
	this.autorun(function () {
		var temp = Template.currentData();
		$('.new-tooltip').tooltip();
		$('.new-tooltip').removeClass('new-tooltip');

	});
};
Template.words.helpers({
	words: function () {
		if (this) {
			return this;
		}
	},
	moment: function () {
		return moment(this.time).format('hh:mm:ss MMMM Do, YYYY');
	}
});

Template.wordInput.helpers({
	voting: function () {
		var status = Status.findOne();
		if (status) {
			if (status.voting) {
				return true;
			}
		}
		return false;
	},
	newVote: function () {
		if (Meteor.user()) {
			var status = Status.findOne();
			if (status) {
				var votes = Votes.find({number: status.wordNum}, {sort: {time: -1}, limit: 5});
				if (votes.count()) return Votes.find({number: status.wordNum}, {sort: {time: -1}, limit: 5});
				return 0;
			}
		}
	},
	progressStyle: function () {
		var status = Status.findOne();
		if (status) {
			if (status.percent == 100) {
				if (status.votes == 0) {
					return 'progress-bar-warning';
				}
				return 'progress-bar-success';
			}
		}
	},
	percent: function () {
		var status = Status.findOne();
		if (status) {
			return status.percent;
		}
		return 0;
	},
	votes: function () {
		var status = Status.findOne();
		if (status) {
			return status.votes;
		}
		return 0;
	},
	pluralizeVote: function () {
		var status = Status.findOne();
		if (status) {
			if (status.votes != 1) return 's';
		}
	},

	currentVote: function () {
		var status = Status.findOne();
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
		var status = Status.findOne();
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
