var DRAW = [];
var SELECTED = [];
var SELECTEDIND = [];
var DECK = [];

function CustomPick(canvas){
	this.canvas = canvas;
	this.handSize = 5;
	this.drawSize = 5;

	this.initCustomPick = function(){
		//to do: import a decklist
		DECK = CARDLIST;
		for(var i = 0; i < this.drawSize; i++){
			DRAW[i] = null;
		}
		this.openCustom();
	}
	this.openCustom = function(){
		this.drawFromDeck();
		document.getElementById("pick_canvas").style.display='block';
		document.getElementById("custom_canvas").style.display='none';
		document.getElementById("confirm").style.display='block';
		this.drawHand();
	}

	this.drawFromDeck = function(){
		for(var i = 0; i < 5; i++){
			if(DRAW[i] === null){
				this.ind = Math.floor(Math.random() * DECK.length)
				DRAW[i] = DECK[this.ind];
				DECK.splice(this.ind, 1);
			}
		}
	}

	this.drawHand = function(){
		var canvas = this.canvas;
		var ctx = canvas.getContext('2d');
		ctx.fillStyle="#000000";
		ctx.fillRect(0,0,canvas.width,canvas.height);
		for(var i=0;i<this.drawSize;i++){
			this.drawCard(i);
		}
	}

	this.drawCard = function(x){
		var canvas = this.canvas;
		var cwidth = canvas.width;
		var cheight = canvas.height;
		var cellWidth = cwidth/this.drawSize;
		var left = x*cellWidth;
		var ctx = canvas.getContext('2d');
		if(this.matchesCode(SELECTED, DRAW[x])){
			ctx.fillStyle="#FFFFFF";
		}
		else{
			ctx.fillStyle="#FF0000";
		}
		if(SELECTEDIND.indexOf(x) !== -1){
			ctx.fillStyle="#00FF00";
		}
		ctx.fillRect(left+2,2,cellWidth-4,cheight-4);
		ctx.fillStyle="#000000";
		ctx.font = "11px Arial";
		ctx.textAlign = "center";
		if(!DRAW[x]){
			ctx.fillText("No Card", left+cellWidth/2, cheight-6);
		}
		else{
			ctx.fillText(DRAW[x].name, left+cellWidth/2, cheight-6);
		}
	}

	this.confirm = function(){
		HAND = SELECTED;
		for(var i=0;i<SELECTEDIND.length;i++){
			DRAW[SELECTEDIND[i]] = null;
		}
		SELECTEDIND = [];
		SELECTED = [];
		document.getElementById("pick_canvas").style.display='none';
		document.getElementById("custom_canvas").style.display='block';
		document.getElementById("confirm").style.display='none';
		custom.drawHand();
	}

	this.mouseDown = function(e){
		this.mouseCellX = Math.floor(this.drawSize * e.offsetX/e.target.width);
		board.showRange(player, DRAW[this.mouseCellX]);

		this.alreadyInd = SELECTEDIND.indexOf(this.mouseCellX);
		if(this.alreadyInd !== -1){
			SELECTED.splice(this.alreadyInd, 1);
			SELECTEDIND.splice(this.alreadyInd, 1);
		}
		else{
			if(this.matchesCode(SELECTED, DRAW[this.mouseCellX])){
				SELECTED.push(DRAW[this.mouseCellX]);
				SELECTEDIND.push(this.mouseCellX);
			}
		}
	}.bind(this);

	this.matchesCode = function(selectedArr, cardtoAdd){
		selectedCodeArr = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
		for(var i = 0; i < selectedArr.length; i++){
			if(selectedCodeArr.length === 0){
				selectedCodeArr = selectedArr[0].code;
			}
			else{
				selectedCodeArr = selectedCodeArr.filter(value => -1 !== selectedArr[i].code.indexOf(value));
			}
		}
		for(var j = 0; j < cardtoAdd.code.length; j++){
			if(selectedCodeArr.indexOf(cardtoAdd.code[j]) !== -1){
				return true;
			}
		}
		return false;
	}

	this.mouseUp = function(e){
		board.draw();
		this.drawHand();
	}.bind(this);
}
