//hack for slow procs not pushing keepalive fast enough
process.argv = _.without(process.argv, '--keepalive');

Meteor.startup(function () {
	var status = Status.findOne();
	if (!status) {
		var init = {
			voting: true,
			wordNum: 1
		};
		Status.insert(init);
	}
	console.log("LISTENING"); 

	Meteor.setInterval(processVotes, 5000);

});
