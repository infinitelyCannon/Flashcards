var app = app || {};

var cardSets = Backbone.Collection.extend({
	model: app.card,
	
	localStorage: new Backbone.LocalStorage('flashcards'),
	
	sort: function(category){
		var title = category;
		return this.filter(function(card){
			return (card.get("category") == category);
		});
	}
});
app.Cards = new cardSets();
