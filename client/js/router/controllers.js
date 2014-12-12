BaseController = RouteController.extend({
	onBeforeAction: function () {
		Session.set('route', this.route._path);
		this.next();
	}
});
