Template.myNavbar.helpers({
	activeNav: function (nav){
		check(nav, String);
		var currentRoute = Session.get('route');
		if(currentRoute){

			if (nav == currentRoute.substr(0,nav.length)) {
				return 'active';					
			}
			return '';
		}
	}
});
