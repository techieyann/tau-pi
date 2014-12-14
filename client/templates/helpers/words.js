var scrub = function (word) {
	return word.replace(/[0123456789_\W]/g, '');
};
Template.words.helpers({
	newVote: function () {
		var status = Status.findOne();
		if (status) {
			return Votes.find({number: status.wordNum}, {sort: {time: -1}, limit: 5});
		}
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
	percent: function () {
		if (Session.equals('numVotes', 0)) return 0;
		var voteDiff = Session.get('voteDiff');

		return (voteDiff/50);
	},
	votes: function () {
		return Session.get('numVotes');
	},
	focus: function () {
		Meteor.setTimeout(function () {$('#new-word').focus();}, 200);
	}
});

Meteor.setInterval(function () {
	var status = Status.findOne();
	if (status) {
		Session.set('numVotes', Votes.find({number: status.wordNum}).count());
		if (status.lastVote) {
			var lastVote = status.lastVote.time;
			var now = moment();
			var diff = now.diff(lastVote) - 1000;
			Session.set('voteDiff', diff%5000);
		}
	}
}, 500);

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
	'submit #new-word-form': function (e) {
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
				$('#new-word').val('');
				$('#new-word').focus();
			});
		}
		else alert('warning', 'Currently tabulating votes, please wait.');
	}
};
