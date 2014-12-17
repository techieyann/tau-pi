Meteor.startup(function () {
	Session.setDefault("alertMessage", null);
	Session.setDefault('earlier', false);
});
