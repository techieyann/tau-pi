Router.configure({
	layoutTemplate: 'index',
	yieldTemplates: {
		'myHeader': {to: 'header'},
		'myNavbar': {to: 'navbar'},
		'myFooter': {to: 'footer'}
	},
	notFoundTemplate: 'error404',
	loadingTemplate: 'loading'
});

Router.onBeforeAction('loading');
