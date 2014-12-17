Template.history.helpers({
	previousWords: function () {
		if (this) return this;
	},
	moment: function () {
		return moment(this.time).format('h:mm:ss a - MMMM Do, YYYY');
	},
	firstDate: function () {
		if (this) {
			var formatStr = 'MM/D/YY - h:mm:ss a';
			var that = this.fetch();
			var firstTime = that[0].time;
			return moment(firstTime).format(formatStr);
		}

	},
	lastDate: function () {

		if (this) {
			var formatStr = 'MM/D/YY - h:mm:ss a';
			var that = this.fetch();
			var lastTime = that[that.length-1].time;
			return moment(lastTime).format(formatStr);
		}

	},
});

Template.history.rendered = function () {
		$('[data-toggle=tooltip]').tooltip();
};
