Meteor.publish('words', function() {
	return Words.find(); 
});

Meteor.publish('votes', function () {
	return Votes.find();
}); 

Meteor.publish('status', function () {
	return Status.find();
});

Meteor.publish('percent-votes', function () {
	return pvStatus.find();
});

