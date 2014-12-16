Words = new Mongo.Collection('words');
Votes = new Mongo.Collection('votes');
Status = new Mongo.Collection('status');
pvStatus = new Mongo.Collection('percent-votes');



Meteor.methods({
	voteWord: function (word) {
		var status = Status.findOne();
		if (status) {
			if (status.voting) {
				var vote = {
					member: Meteor.user()._id,
					word: word,
					number: status.wordNum
				};
				Votes.upsert({member: vote.member, number: vote.number}, vote);
			}
		}
	}
});
