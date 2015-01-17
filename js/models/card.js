var app =  app || {};

app.card = Backbone.Model.extend({
	defaults: {
		"sideName": [],
		"sideContent": [],
		"category": "",
		"title": ""
	}
});
