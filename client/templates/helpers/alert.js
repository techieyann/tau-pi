Template.alert.helpers({
	alertActive: function () {
		return !Session.equals("alertMessage", null);
	},
	alertMessage: function () {
		return Session.get("alertMessage");
	},
	alertLevel: function () {
		return Session.get("alertLevel");
	}
});

var alertTimeoutId = null;

alert = function (level, message, length) {
	if (alertTimeoutId != null) Meteor.clearTimeout(alertTimeoutId);

	Session.set("alertLevel", level);
	Session.set("alertMessage", message);

	if (length != null)	alertTimeoutId = Meteor.setTimeout(clearAlert, length);
	else alertTimeoutId = Meteor.setTimeout(clearAlert, 4000);
};

clearAlert = function () {
	Session.set("alertLevel", null);
	Session.set("alertMessage", null);

	alertTimeoutId = null;
};
