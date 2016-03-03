var EMPTY_LIST = "<p>You have no cards setup. Use the plus button to get started.</p>";
var HOME_HELP = "Click the plus button at the bottom to create a new card set.";
var LIST_HELP = "";
var CARD_HELP = "";

// Main Collection
var CardSet = Backbone.Collection.extend({
    model: Card,
    
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

// Models
var Card = Backbone.Model.extend({
    defaults: {
        side1: '',
        side2: '',
        category: ''
    }
});

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
var CatListItem = Backbone.View.extend({
    tagName: 'paper-item',
    
    template: _.template( $("#category-list").html() ),
    
    events: {
        'click .editBtn': 'editCat',
        'click .deleteBtn': 'deleteCat'
    },
    
    render: function(){
        
    },
    
    editCat: function(){
        
    },
    
    deleteCat: function(){
        
    }
});

var CardView = Backbone.View.extend({
    template: _.template( $("#swiper-card").html() ),
    
    events: {
        "click .tab1": 'change',
        "click .tab2": 'change'
    },
    
    change: function(){
        var selected = this.$("paper-tabs").selected;
        
        this.$("iron-pages").select(selected);
    },
    
    close: function(){
        
    }
});

/* STATIC VIEW: New Category Diaolog */
var DialogNew = Backbone.View.extend({
    el: '#dialogNew',
    
    events: {
        'click .confirm': 'newCategory'
    },
    
    initialize: function(){
      this.$input = this.$("#new")[0];
    },
    
    newCategory: function(){
       // var isValid = (this.$input.validate() && cardSet.hasName());
       this.$inpur.attr("error-message", "Error: Cannot be empty");
        
        if( this.$input.validate() ){
            if( cardSet.hasName() ){
                this.$input.attr("error-message", "Error: Category already exists");
                this.$input.attr("invalid", true);
            }else{
                catSet.add( this.$input.value.trim() );/*  TODO: Change catSet to collection set */
                this.$input.value = "";
                this.$el.close();
            }
        }else{
            return;
        }
    },
    
    open: function(){
        this.$el.open();
    }
});

/** SATIC VIEW: Category List **/
var CatList = Backbone.View.extend({
    el: "#page1",
    
    collection: /* Collection Name */ cardSet,
    
    events: {
      "click #CatFab": "newCat"
    },
    
    initialize: function(){
        this.views = [];
        
        this.listenTo(this.collection, "update", this.render);
        
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
        
        var categoryList = this.collection.pluck('category');
        
        for(var i = 0; i < categoryList.length; i++){
            var newItem = new CatListItem();
            
            this.$el.append( newItem.render().el );
            
            this.views.push(newItem);
        }
        
    },
    
    clear: function(){
        _.each(this.views, function(view){
            view.close();
        });
        for(var i = 0; i < this.views.length; i++){
            delete this.views[i];
        }
    },
    
    newCat: function(){
        //TODO: DialogNew.open();
    }
});

/* SATIC VIEW: Model List */
var ModelList = Backbone.View.extend({
    el: "#page2",
    
    collection: cardSet,
    
    events: {
        "click #ModelFab": "newModel"
    },
    
    initialize: function(){
        this.views = [];
    },
    
    render: function(cat){
        var models = this.collection.where({category: cat});
        
        for(var i = 0; i < modles.length; i++){
            var newModel = new ModelListItem({model: models[i]});
            
            this.$el.append( newModel.render().el );
            
            this.views.push(newModel);
        }
    },
    
    newModel: function(){
        var newcard = new Card();
        
        this.$el.append( new ModelListItem({model: newcard}).render().el );
        
        this.collection.add(newcard);
    }
});

var ModelListItem = Backbone.View.extend({
    tagName: 'paper-item',
    
    template: _.template( $("#model-editor").html() ),
    
    events: {
        "click .save-card": "update",
        "click .delete-card": "remove"
    },
    
    render: function(){
        this.$el.html( this.template() );
        this.$(".side1").value = this.model.side1;
        this.$(".side2").value = this.model.side2;
        return this;
    },
    
    update: function(){
        this.model.save({ side1: this.$(".side1").value.trim(), side2: this.$(".side2").value.trim() });
    },
    
    remove: function(){
        this.model.destroy();
        this.remove();
        this.unbind();
    }
});

/* STATIC VIEW: Toolbar */
var ToolView = Backbone.View.extend({
    el: "#toolbar",
    
    events: {
        'click #help': 'helpMessage'
    },
    
    initialize: function(){
        this.$title = $(".title")[0];
    },
    
    helpMessage: function(){
        // TODO: Add call to HelpDialog's help() method.
    },
    
    updateTitle: function(name){
        this.$title.html(name);
    }
});

/** STATIC VIEW: Help Dialog **/
var HelpDialog = Backbone.View.extend({
    el: "#helpDialog",
    
    initialize: function(){
        this.message = $("#helpMessage")[0];
        this.helpMessage = HOME_HELP;
    },
    
    help: function(){
        this.message.html(this.helpMessage);
        this.$el.open();
    }
});

/* STATIC VIEW: New */

// Rouoter
var Workspace = Backbone.Router.extend({
    routes: {
        "home": "home"
    },
    
    home: function(){
        
    }
});
