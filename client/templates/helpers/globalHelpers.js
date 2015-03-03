Template.registerHelper('frontPage', function () {
	var status = Session.get("status");
	if (status) {
		var frontPage = Math.ceil(status.wordNum / NUM_WORDS);
		return Session.equals("pageNum", frontPage);
	}
});
