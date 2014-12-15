//hack for slow procs not pushing keepalive fast enough
process.argv = _.without(process.argv, '--keepalive');

Meteor.startup(function () {
	var status = Status.findOne();
	if (!status) {
		var init = {
			voting: true,
			wordNum: 1,
			percent: 0,
			votes: 0
		};
		Status.insert(init);
	}
	console.log("LISTENING"); 
	numCycles = 0;
	updating = false;
	Meteor.setInterval(updateStatus, 500);
});
