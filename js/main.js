var EMPTY_LIST = "<p id='empty'>You have no cards setup. Use the create button to get started.</p>";
var HOME_HELP = "Click the create button at the bottom to create a new card set.";
var LIST_HELP = "Click the plus to create a new card. Press the trash button to delete the set.";
var CARD_HELP = "Swipe (on mobile) or scroll with the mouse to navigate through the cards.";
var app = app || {};
var mySwiper;

// Models
app.Card = Backbone.Model.extend({
    defaults: {
        side1: '',
        side2: '',
        category: ''
    }
});

// Main Collection
app.CardSet = Backbone.Collection.extend({
    model: app.Card,
    
    localStorage: new Backbone.LocalStorage('flashcards-beta'),
    
    categories: function(name){
        return this.pluck(name);
    },
    
    hasName: function(name){
        if(this.findWhere({category: name}) == undefined){
            return false;
        }
        return true;
    }
});
app.cardSet = new app.CardSet;
app.cardSet.fetch();

/* STATIC MODEL: CATEGORY DESCRIPTION */
/*
var CatSet = Backbone.Model.extend({
    defaults:{
        catNum: 0,
        categories: []
    },
    
    urlRoot: "/catsetBeta",
    
    addNew: function(name){
        
    }
});
*/

// Views
app.CatListItem = Backbone.View.extend({
    tagName: 'div',
    
    template: _.template( $("#category-list").html() ),
    
    render: function(info){
        this.$el.html( this.template(info) );
        return this;
    },
    
    close: function(){
    	this.remove();
    	this.unbind();
    }
});

//TODO: Remove this view. Has been replaced with StudyViewItem.
app.CardView = Backbone.View.extend({
    tagName: 'div',
    
    className: 'swiper-slide',
    
    template: _.template( $("#swiper-card").html() ),
    
    events: {
        "click .tab1": 'change',
        "click .tab2": 'change'
    },
    
    change: function(){
        var selected = this.$("paper-tabs")[0].selected;
        
        this.$("iron-pages")[0].select(selected);
    },
    
    close: function(){
        this.remove();
        this.unbind();
    }
});

/* STATIC VIEW: New Category Diaolog */
app.DialogNew = Backbone.View.extend({
    el: '#dialogNew',
    
    events: {
        'click .confirm': 'newCategory'
    },
    
    initialize: function(){
      this.$input = this.$("#new");
    },
    
    newCategory: function(){
       // var isValid = (this.$input.validate() && cardSet.hasName());
       this.$input.attr("error-message", "Error: Cannot be empty");
        
        if( this.$input[0].validate() ){
            if( app.cardSet.hasName( this.$input[0].value ) ){
                this.$input.attr("error-message", "Error: Category already exists");
                this.$input.attr("invalid", true);
            }else{
                app.cardSet.create({category: this.$input[0].value.trim()});
                this.$input[0].value = "";
                this.el.close();
            }
        }else{
            return;
        }
    },
    
    open: function(){
        this.el.open();
    }
});
app.dialogNew = new app.DialogNew;

/** SATIC VIEW: Category List **/
app.CatList = Backbone.View.extend({
    el: "#page1",
    
    collection: app.cardSet,
    
    events: {
      "click #CatFab": "newCat"
    },
    
    initialize: function(){
        this.views = [];
        
        this.listenTo(this.collection, "update", this.render);
        this.render();
    },
    
    render: function(){
        if(this.collection.length == 0){
            this.clear;
            this.$el.append(EMPTY_LIST);
            return;
        }
        
        if(this.views.length != 0){
            this.clear;
        }
        
        if( $("#empty") ){
            $("#empty").remove();
        }
        
        var categoryList = this.collection.pluck('category');
        
        for(var i = 0; i < categoryList.length; i++){
        	var newInfo = {category: categoryList[i], categoryNum: this.collection.where({category: categoryList[i]}).length };
            var newItem = new app.CatListItem();
            
            this.$el.append( newItem.render(newInfo).el );
            
            this.views.push(newItem);
            
            console.log(this.views);
        }
        
    },
    
    clear: function(){
        $("#empty").remove();
        
        for(var i = 0; i < this.views.length; i++){
            this.views[i].close();
            delete this.views[i];
        }
        this.views = _.compact(this.views);
    },
    
    newCat: function(){
        app.dialogNew.open();
    }
});
app.catList = new app.CatList;

/* SATIC VIEW: Model List */
app.ModelList = Backbone.View.extend({
    el: "#page2",
    
    collection: app.cardSet,
    
    events: {
        "click #ModelFab": "newModel"
    },
    
    initialize: function(){
        this.views = [];
        this.catName = "";
    },
    
    render: function(cat){
        this.catName = cat;
        
        var models = this.collection.where({category: cat});
        
        for(var i = 0; i < models.length; i++){
            var newModel = new app.ModelListItem({model: models[i]});
            
            this.$el.append( newModel.render().el );
            
            this.views.push(newModel);
        }
    },
    
    newModel: function(){
        var newcard = new app.Card({category: this.catName});
        var newView = new app.ModelListItem( {model: newcard} );
        
        this.$el.append( newView.render().el );
        
        this.views.push(newView);
        
        this.collection.add(newcard);
    },
    
    clear: function(){
    	for(var i = 0; i < this.views.length; i++){
    	    this.views[i].close();
    		delete this.views[i];
    	}
    	this.views = _.compact(this.views);
    }
});
app.modelList = new app.ModelList;

/* STATIC VIEW: Flashcard Viewer */
app.StudyView = Backbone.View.extend({
	el: ".swiper-wrapper",
	
	collection: app.cardSet,
	
	initialize: function(){
		this.views = [];
	},
	
	render: function(cat){
		var models = this.collection.where({category: cat});
		
		for(var i = 0; i < models.length; i++){
			var card = new app.StudyViewItem({model: models[i]});
			
			this.$el.append( card.render.el );
			
			this.views.push(card);
		}
		
		mySwiper = new Swiper(".swiper-container", {
			direction: 'horizontal',
			loop: false,
			pagination: ".swiper-pagination",
			spaceBetween: 200,
			mousewheelControl: true
		});
	},
	
	clear: function(){
		mySwiper.destroy(true, true);
		for(var i = 0; i < this.views.length; i++){
		    this.views[i].close();
		    delete this.views[i];
		}
		this.views = _.compact(this.views);
	}
});
app.studyView = new app.StudyView;

app.ModelListItem = Backbone.View.extend({
    tagName: 'div',
    
    template: _.template( $("#model-editor").html() ),
    
    events: {
        "click .save-card": "update",
        "click .delete-card": "remove"
    },
    
    initialize: function(){
    	this.listenTo(this.model, "destroy", this.close);
    },
    
    render: function(){
        this.$el.html( this.template() );
        this.$(".side1")[0].value = this.model.side1;
        this.$(".side2")[0].value = this.model.side2;
        return this;
    },
    
    update: function(){
        this.model.save({ side1: this.$(".side1")[0].value.trim(), side2: this.$(".side2")[0].value.trim() });
    },
    
    close: function(){
        this.remove();
        this.unbind();
    },
    
    remove: function(){
        this.model.destroy();
        this.remove();
        this.unbind();
    }
});

app.StudyViewItem = Backbone.View.extend({
	className: "swiper-slide",
	
	tagName: "div",
	
	template: _.template( $("#swiper-card").html() ),
	
	events: {
		"click .tab": "update"
	},
	
	update: function(){
		this.$(".tabPages")[0].select( this.$(".tab")[0].selected );
	},
	
	render: function(){
		this.$el.html( this.template(this.model.attributes) );
		return this;
	},
	
	close: function(){
		this.remove();
		this.unbind();
	}
});

/** STATIC VIEW: Help Dialog **/
app.HelpDialog = Backbone.View.extend({
    el: "#helpDialog",
    
    initialize: function(){
        this.message = $("#helpMessage");
        this.helpMessage = HOME_HELP;
    },
    
    help: function(){
        this.message.html(this.helpMessage);
        this.el.open();
    }
});
app.helpDialog = new app.HelpDialog;

/* STATIC VIEW: Delete Category Dialog */
app.DeleteDialog = Backbone.View.extend({
	el: "#dialogDel",
	
	events:{
		'click .confirm': 'removeCat'
	},
	
	initialize: function(){
		this.target = "";
	},
	
	removeCat: function(){
		var targets = cardSet.where({category: target});
		cardSet.remove(targets);
		this.el.close();
		Router.navigate("#home", {trigger: true});
	},
	
	removeQuery: function(name){
		this.target = name;
		this.$("#target").html(name);
		this.el.open();
	}
});
app.deleteDialog = new app.DeleteDialog;

/* STATIC VIEW: Toolbar */
app.ToolView = Backbone.View.extend({
    el: "#toolbar",
    
    events: {
        'click #help': 'helpMessage',
        'click #remove': 'deleteCategory'
    },
    
    initialize: function(){
        this.$title = $(".title");
    },
    
    helpMessage: function(){
        app.helpDialog.help();
    },
    
    updateTitle: function(name){
        this.$title.html(name);
    },
    
    showDel: function(){
      this.$("#remove").show();  
    },
    
    hideDel: function(){
        this.$("#remove").hide();
    },
    
    deleteCategory: function(){
    	app.deleteDialog.removeQuery( this.$title.html().trim() );
    }
});
app.toolView = new app.ToolView;

// Rouoter
app.Workspace = Backbone.Router.extend({
    routes: {
        "home": "home",
        "edit/:category": "page2",
        "view/:category": "page3"
    },
    
    home: function(category){
        $("#pages")[0].select(0);
        app.toolView.hideDel();
        app.toolView.$title.html("Flashcards");
        app.modelList.clear();
        app.studyView.clear();
        app.helpDialog.helpMessage = HOME_HELP;
    },
    
    page2: function(category){
    	app.toolView.showDel();
    	app.toolView.$title.html(category);
    	$("#home").attr("disabled", false);
    	$("#pages")[0].select(1);
    	app.modelList.render(category);
    	app.helpDialog.helpMessage = LIST_HELP;
    },
    
    page3: function(category){
        app.toolView.hideDel();
        app.toolView.$title.html(category);
    	$("#pages")[0].select(2);
    	app.studyView.render(category);
    	app.helpDialog.helpMessage = CARD_HELP;
    }
});
app.Router = new app.Workspace;
