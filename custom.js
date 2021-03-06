var HAND = [];

function Custom(canvas){
	this.canvas = canvas;
	this.handSize = 5;
	this.width = 5;

	this.drawHand = function(){
		$.post("save.php",{id:"confirm"+player.name, state: JSON.stringify(false)});
		var canvas = this.canvas;
		var ctx = canvas.getContext('2d');
		ctx.fillStyle="#000000";
		ctx.fillRect(0,0,canvas.width,canvas.height);
		for(var i=0;i<this.handSize;i++){
			this.drawCard(i);
		}
	}

	this.drawCard = function(x){
		var canvas = this.canvas;
		var cwidth = canvas.width;
		var cheight = canvas.height;
		var cellHeight = cheight/this.handSize;
		var down = x*cellHeight;
		var ctx = canvas.getContext('2d');
		if(!HAND[x]){
			ctx.fillStyle="#000000";
			ctx.fillRect(0 ,down, cwidth, cellHeight);
			ctx.fillStyle="#FFFFFF";
			ctx.fillRect(2 ,down+2, cwidth-4, cellHeight - 4);
			ctx.fillStyle="#000000";
			ctx.fillRect(4 ,down+4, cwidth-8, cellHeight - 8);
			ctx.fillStyle="#FFFFFF";
			ctx.font = "11px Arial";
			ctx.textAlign = "center";
			ctx.fillText("No Data", cwidth/2, down + cellHeight - 10);
		}
		else{
			ctx.fillStyle="#FFFFFF";
			if(x === 0){
				ctx.fillStyle="#00FF00";
			}
			ctx.fillRect(2,down+2,cwidth-4,cellHeight - 4);
			ctx.fillStyle="#000000";
			ctx.font = "11px Arial";
			ctx.textAlign = "center";
			ctx.fillText(HAND[x].name, cwidth/2, down + cellHeight - 10);
		}
	}

	this.mouseDown = function(e){
		this.mouseCellX = Math.floor(this.handSize * e.offsetY/e.target.height);
		if(HAND[this.mouseCellX]){
			board.showRange(player, HAND[this.mouseCellX]);
		}
	}.bind(this);

	this.mouseUp = function(e){
		board.draw();
	}.bind(this);
}
