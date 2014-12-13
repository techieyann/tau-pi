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
			var diff = now.diff(lastVote);
			Session.set('voteDiff', diff%5000);
		}
	}
}, 500);

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
			Meteor.call('voteWord', newWord, function (err) {
				if (err) {
					alert('danger', 'Voting Error: '+err.message);
					return;
				}
				alert('success', 'Voting Success: "'+newWord+'"');
				$('#new-word').val('');
				$('#new-word').focus();
			});
		}
		else alert('warning', 'Currently tabulating votes, please wait.');
	}
};
