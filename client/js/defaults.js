Meteor.startup(function () {
	Session.setDefault("alertMessage", null);
	Session.setDefault('pageNum', 0);
});
