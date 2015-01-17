var app = app || {};

app.AppView = Backbone.View.extend({
	el: $("body"),
	
	events: {
		"click .icon-bars": "navigate",
		"click #overlay": "navResume"
	},
	
	initialize: function(){
		console.log("App View started.");
	},
	
	navigate: function(){
		$("#overlay").css("display","block");
		panelTeen.play();
		overlayTween.play();
	},
	
	navResume: function(){
		panelTeen.reverse();
		overlayTween.reverse();
	}
});
