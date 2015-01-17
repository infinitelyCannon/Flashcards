var app = app || {};
var panelTeen = TweenLite.to("#panel", 0.4, {left:0, paused:true});
var overlayTween = TweenLite.to("#overlay", 0.4, {opacity:0.4, paused:true, onReverseComplete:function(){
	$("#overlay").css("display","none");
}});

$(function(){
	new app.AppView();
});
