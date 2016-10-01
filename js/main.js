var app = app || {};
var HOME_HELP = "Click the add button at the bottom to create a new category.<br />(All categories will have 1 card by default.)";
var EDIT_HELP = "Click the create button to create a new card. Click the delete button to delete the category.";
var VIEW_HELP = "Use the scroll wheel on the cards or swipe to view card set.";
var EMPTY_NOTE = "<p id='empty'>You have no cards setup. Create a category to get started.</p>";
var mySwiper;
var dialogIN = document.getElementById("dialogInfo");

// Model(s)
app.Card = Backbone.Model.extend({
   defaults:{
       side1: '',
       side2: '',
       category: ''
   } 
});

// Collection
app.CardSet = Backbone.Collection.extend({
   model: app.Card,
   
   localStorage: new Backbone.LocalStorage('flashcards-beta-v1'),
   
   categories: function(){
       return _.uniq(this.pluck("category"));
   },
   
   hasName: function(name){
       if(this.findWhere({category: name}) === undefined){
           return false;
       }
       return true;
   },
   
   numOfCards: function(cat){
       return this.where({category: cat}).length;
   }
});
app.cardSet = new app.CardSet;
app.cardSet.fetch();

app.ModelListItem = Backbone.View.extend({
    tagName: 'div',
    
    template: _.template( $("#modelEditor").html() ),
    
    events: {
        'click .saveBtn': 'submit',
        'click .delBtn': 'clear'
    },
    
    initialize: function(){
        this.$form;
        
        //this.listenTo(this.$form[0], "iron-form-submit", this.update);
        this.listenTo(this.model, "destroy", this.close);
    },
    
    render: function(){        
        this.$el.html( this.template(this.model.attributes) );
        this.$form = this.$(".modelForm");
        //this.listenTo(this.$form, "iron-form-submit", this.update);
        this.$form.on("iron-form-submit", {context: this}, this.update);
        
        return this;
    },
    
    submit: function(){
        this.$form[0].submit(event);
    },
    
    update: function(event){
        /** jQuery Issue
         * When called though the .on() binding this function gets called with the form element itself as the context
         * Fix has been made that passes the View (this objcet) through event handler.
         */
        event.data.context.model.save({side1: event.detail.side1, side2: event.detail.side2});
    },
    
    close: function(){
        this.$form.off();
        this.remove();
        this.unbind();
    },
    
    clear: function(){
        this.model.destroy();
    }
});

app.CatListItem = Backbone.View.extend({
    tagName: 'div',
    
    template: _.template( $("#categoryList").html() ),
    
    render: function(info){
        this.$el.html( this.template(info) );
        return this;
    },
    
    close: function(){
        this.remove();
        this.unbind();
    }
});

app.SwiperCardItem = Backbone.View.extend({
    tagName: "div",
    
    className: "swiper-slide",
    
    template: _.template( $("#swiperCard").html() ),
    
    events: {
        "click .tab": "selectTab"
    },
    
    render: function(){
        this.$el.html( this.template(this.model.attributes) );
        return this;
    },
    
    selectTab: function(){
        this.$(".tabPages")[0].select( this.$(".tab")[0].selected );
    },
    
    close: function(){
        this.remove();
        this.unbind();
    }
});

/* STATIC VIEW: Toolbar */
app.ToolView = Backbone.View.extend({
    el: '#toolbar',
    
    events: {
        'click #help': 'helpMessage',
        'click #remove': 'clearCat',
        'click #back': 'back',
        'click #info': 'info'
    },
    
    initialize: function(){
        this.$title = $(".title");
    },
    
    updateTitle: function(name){
        this.$title.html(name);
    },
    
    helpMessage: function(){
        app.helpDialog.help();
    },
    
    showBack: function(){
        $("#back").show();
    },
    
    hideBack: function(){
        $("#back").hide();
    },
    
    showDel: function(){
        $("#remove").show();
    },
    
    hideDel: function(){
        $("#remove").hide();
    },
    
    clearCat: function(){
        app.delDialog.start();
    },
    
    back: function(){
        app.Router.navigate("home", {trigger: true, replace: true});
    },
    
    info: function(){
    	dialogIN.open();
    }
});
app.toolView = new app.ToolView;

/* STATIC VIEW: Help Dialog */
app.HelpDialog = Backbone.View.extend({
    el: "#helpDialog",
    
    initialize: function(){
        this.message = $("#helpMessage");
        this.helpMessage = HOME_HELP;
    },
    
    help: function(){
        this.message.html(this.helpMessage);
        this.el.open();
    },
    
    setMessage: function(msg){
        this.helpMessage = msg;
    }
});
app.helpDialog = new app.HelpDialog;

/* STATIC VIEW: Delete Dialog */
app.DelDialog = Backbone.View.extend({
    el: "#dialogDel",
    
    events: {
        'click .confirm': 'clear'
    },
    
    start: function(){
        this.el.open();
    },
    
    clear: function(){
        this.el.close();
        app.modelList.clearAll();
        app.Router.navigate("home", {trigger: true, replace: true});
    }
});
app.delDialog = new app.DelDialog;

/* STATIC VIEW: Page 1 */
app.CatList = Backbone.View.extend({
    el: "#page1",
    
    events: {
        'click #CatFab': 'newFab'
    },
    
    initialize: function(){
        this.views = [];
        
        this.listenTo(app.cardSet, "add", this.render);
        this.render();
    },
    
    render: function(){
        var cats = app.cardSet.categories();
        var newInfo;
        var newItem;
        
        /**
         * Retrieve the list of categories.
         * Clear out whatever already exists.
         * Then, for every unique category create a new cat list item
         */
        this.clear();
        
        if(cats.length !== 0){
            for(var i = 0; i < cats.length; i++){
                newInfo = {category: cats[i], categoryNum: app.cardSet.numOfCards(cats[i])};
                newItem = new app.CatListItem();
                this.$el.append( newItem.render(newInfo).el );
                this.views.push(newItem);
            }
        }
        
        if(this.$el.children("div").length === 0){
            this.$el.prepend(EMPTY_NOTE);
        }
    },
    
    newFab: function(){
        app.newDialog.open();
    },
    
    clear: function(){
        if( $("#empty").length !== 0 ){
            $("#empty").remove();
        }
        
        for(var j = 0; j < this.views.length; j++){
            this.views[j].close();
            delete this.views[j];
        }
        this.views = _.compact(this.views);
    }
});
app.catList = new app.CatList;

/* STATIC VIEW: Page 2 */
app.ModelList = Backbone.View.extend({
    el: "#page2",
    
    events: {
        'click #ModelFab': 'createModel'
    },
    
    initialize: function(){
        this.views = [];
        this.category = "";
        this.cards = [];
    },
    
    render: function(cat){
        this.category = cat;
        this.cards = app.cardSet.where({category: cat});
        var newItem;
        
        this.clear();
        
        for(var k = 0; k < this.cards.length; k++){
            newItem = new app.ModelListItem({model: this.cards[k]});
            this.$el.append(newItem.render().el);
            this.views.push(newItem);
        }
    },
    
    createModel: function(){
        var newModel = new app.Card({category: this.category});
        var newView = new app.ModelListItem({model: newModel});
        app.cardSet.add(newModel);
        this.$el.append(newView.render().el);
        this.views.push(newView);
    },
    
    clear: function(){
        for(var l = 0; l < this.views.length; l++){
            this.views[l].close();
            delete this.views[l];
        }
        this.views = _.compact(this.views);
    },
    
    clearAll: function(){
        for(var m = 0; m < this.cards.length; m++){
            this.cards[m].destroy();
        }
        this.cards = [];
        this.views = [];
    }
});
app.modelList = new app.ModelList;

/* STATIC VIEW: Page 3 */
/*
 * Note Regarding Swiper: 
 * The swiper set of sliders must be instantiated AFTER neon-animated-pages switches to the third page.
 */
app.StudyList = Backbone.View.extend({
    el: "#page3",
    
    initialize: function(){
        this.swipeWrapper = this.$(".swiper-wrapper");
        this.cards = [];
        this.views = [];
    },
    
    render: function(cat){
        this.cards = app.cardSet.where({category: cat});
        var newCard;
        
        for(var i = 0; i < this.cards.length; i++){
            newCard = new app.SwiperCardItem({model: this.cards[i]});
            this.swipeWrapper.append(newCard.render().el);
            this.views.push(newCard);
        }
    },
    
    clear: function(){
        for(var i = 0; i < this.views.length; i++){
            this.views[i].close();
            delete this.views[i];
        }
        this.views = [];
        
        if(mySwiper !== undefined){
            mySwiper.destroy();
            mySwiper = undefined;
        }
    },
    
    launch: function(){
        mySwiper = new Swiper('.swiper-container',{
            direction: 'horizontal',
            loop: true,
            pagination: '.swiper-pagination',
            spaceBetween: 200,
            mousewheelControl: true
        });
    }
});
app.studyList = new app.StudyList;

/* STATIC VIEW: New Categorry Dialog */
app.NewDialog = Backbone.View.extend({
   el: "#dialogNew",
   
   events:{
       'click .confirm': 'submit'
   },
   
   initialize: function(){
       this.$form = this.$("#dialogForm");
       this.$input = this.$("#new");
       
       this.listenTo(this.$form[0], "iron-form-submit", this.newCategory);
   },
   
   open: function(){
       this.el.open();
   },
   
   submit: function(){
       
       this.$form[0].submit(event);
       /*
       app.cardSet.create({category: cat});
       this.$input[0].value = "";
       this.el.close();
       */
   },
   
   newCategory: function(event){
       //console.log(JSON.stringify(event.detail));
       app.cardSet.create({category: event.detail.category});
       this.$input[0].value = "";
       this.el.close();
   }
});
app.newDialog = new app.NewDialog;

app.Workspace = Backbone.Router.extend({
    routes: {
        "home":             "home",
        "edit/:category":   "edit",
        "view/:category":   "view"
    },
    
    home: function(){
        app.catList.render();
        $("#pages")[0].select(0);
        app.toolView.hideBack();
        app.toolView.hideDel();
        app.toolView.updateTitle("Flashcards");
        app.helpDialog.setMessage(HOME_HELP);
        app.modelList.clear();
        app.studyList.clear();
    },
    
    edit: function(category){
        app.modelList.render(category);
        $("#pages")[0].select(1);
        app.toolView.showBack();
        app.toolView.showDel();
        app.toolView.updateTitle(category);
        app.helpDialog.setMessage(EDIT_HELP);
    },
    
    view: function(category){
        $("#pages")[0].select(2);
        app.studyList.render(category);
        app.toolView.showBack();
        app.toolView.updateTitle(category);
        app.studyList.launch();
        app.helpDialog.setMessage(VIEW_HELP);
    }
});
app.Router = new app.Workspace;

// Begin Backbone Routing
Backbone.history.start();