/**
 * @author infinitelyCannon
 */
var unitEight = ["allege", "arrant", "badinage", "conciliate", "countermand","echelon","exacerbate","fatuous","irrefutable","juggernaut","lackadaisical","litany","macabre","paucity","portend","raze","recant","saturate","saturnine","slough"];
var unitNine = ["acclamation", "bucolic", "calumniate", "chary", "collusion", "dilettante", "imperturbable", "increment", "mandate", "paltry", "paroxysm", "pedantry", "peregrination", "redolent", "refulgent", "shibboleth", "tyro", "unremitting", "vacillate", "vituperative"];
var uTen = ["askance", "attenuate","benign","cavil","charlatan","decimate","foible","forgo","fraught","inure","luminous","obsequious","obtuse","oscillate","penitent","peremptory","rebuff","reconnoiter","shambles","sporadic"];
var result = [
	{"card": "Not Answered"},
	{"card": "Not Answered"},
	{"card": "Not Answered"},
	{"card": "Not Answered"},
	{"card": "Not Answered"},
	{"card": "Not Answered"},
	{"card": "Not Answered"},
	{"card": "Not Answered"},
	{"card": "Not Answered"},
	{"card": "Not Answered"},
	{"card": "Not Answered"},
	{"card": "Not Answered"},
	{"card": "Not Answered"},
	{"card": "Not Answered"},
	{"card": "Not Answered"},
	{"card": "Not Answered"},
	{"card": "Not Answered"},
	{"card": "Not Answered"},
	{"card": "Not Answered"},
	{"card": "Not Answered"}
];

function eight(num, element, card){
	var choice = prompt("Enter Word");
	if(unitEight[num] === choice){
		result[card].card = "Correct";
		$(element).text(choice);
		$(element).attr("disabled", "disabled");
		$(element).removeClass("card-btn-active");
	}
	else if(choice === null){
		
	}
	else{
		result[card].card = "Incorrect";
		$(element).text(choice);
		$(element).attr("disabled", "disabled");
		$(element).removeClass("card-btn-active");
	}
}

function nine(num, element, card){
	var choice = prompt("Enter word");
	if(unitNine[num] === choice){
		result[card].card = "Correct";
		$(element).text(choice);
		$(element).attr("disabled", "disabled");
		$(element).removeClass("card-btn-active");
	}
	else if(choice === null || ""){
		
	}
	else{
		result[card].card = "Incorrect";
		$(element).text(choice);
		$(element).attr("disabled", "disabled");
		$(element).removeClass("card-btn-active");
	}
}

function ten(num, element, card){
	var choice = prompt("Enter Word");
	if(uTen[num] === choice){
		result[card].card = "Correct";
		$(element).text(choice);
		$(element).attr("disabled", "disabled");
		$(element). removeClass("card-btn-active");
	}
	else if(choice === null || ""){}
	else{
		result[card].card = "Incorrect";
		$(element).text(choice);
		$(element).attr("disabled", "disabled");
		$(element).removeClass("card-btn-active");
	}
};

var node = document.getElementById("btn");
node.addEventListener('click',function(){
	for(var i = 0; i <= 19; i++){
		document.getElementById("card"+i).innerHTML = result[i].card;
	}
}, false);

function goto(){
	var pos = prompt("Go to card. . .");
	if(pos != null){
		mySwipe.slide(pos - 1, 1000);
	}
}
