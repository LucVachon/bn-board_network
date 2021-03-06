TURNCELL = {
	COMPLETE: "#00FF00",
	INPROGRESS: "#FFA500",
	NOTSTARTED: "#FFFFFF",
}

function Timer(turncount,canvas){
	this.timercells=[];
	this.turncount = turncount;
	this.canvas = canvas;
	this.currentturn = -1;

	this.initTimer = function(){
		this.timercells=[];
		for(var i=0;i<this.turncount;i++){
			this.timercells[i] = TURNCELL.NOTSTARTED;
		}
		this.timercells[0] = TURNCELL.INPROGRESS;
		this.currentturn = 0;
	}

	this.drawCell = function(x){
		var canvas = this.canvas;
		var cwidth = canvas.width;
		var cheight = canvas.height;
		var cellWidth = cwidth/this.turncount;
		var left = x*cellWidth;
		var ctx = canvas.getContext('2d');
		ctx.fillStyle=this.timercells[x];
		ctx.fillRect(left+2,2,cellWidth-4,cheight-4);
	}

	this.draw = function(){
		var canvas = this.canvas;
		var ctx = canvas.getContext('2d');
		var cwidth = canvas.width;
		var cheight = canvas.height;
		ctx.fillStyle="#000000";
		ctx.fillRect(0,0,canvas.width,canvas.height);
		for(var i=0;i<this.turncount;i++){
			this.drawCell(i);
		}
	}

	this.nextTurn = function(){
		this.currentturn++;
		if(this.currentturn > 3){
			this.currentturn = 0;
			HAND = [];
			customPick.openCustom();
		}
		for(var i=0;i<turncount;i++){
			if(i < this.currentturn){
				this.timercells[i] = TURNCELL.COMPLETE;
			}
			else if(i > this.currentturn){
				this.timercells[i] = TURNCELL.NOTSTARTED;
			}
		}
		this.timercells[this.currentturn] = TURNCELL.INPROGRESS;
		
		$.post("save.php",{id:"player"+player.name, state: JSON.stringify(player)});
		$.post("save.php",{id:"confirm"+player.name, state: JSON.stringify(true)});
		this.getConfirmTurn();
	}
	
	this.confirmNextTurnTimeout = 0;
	this.getConfirmTurn = function(){
		clearTimeout(this.confirmNextTurnTimeout);
		this.otherPlayer = "one";
		if(player.name === "one"){
			this.otherPlayer = "two";
		}
		$.post("get.php",{id:"confirm"+this.otherPlayer},function(data){
			try{
				var d = JSON.parse(data);
				if(d){
					$.post("get.php",{id:"player"+this.otherPlayer},function(data){
						var playerData = JSON.parse(data);
						if(player.name === "one"){
							playerTwo.hp = playerData.hp;
							playerTwo.x = playerData.x;
							playerTwo.y = playerData.y;
							playerTwo.action = playerData.action;
							if(playerTwo.action === ACTIONS.CARD){
								playerTwo.card = cards.getCardByName(playerData.card.name);
							}
							playerTwo.invis = playerData.invis;
							playerTwo.guard = playerData.guard;
							playerTwo.stunned = playerData.stunned;
						}
						else{
							playerOne.hp = playerData.hp;
							playerOne.x = playerData.x;
							playerOne.y = playerData.y;
							playerOne.action = playerData.action;
							if(playerOne.action === ACTIONS.CARD){
								playerOne.card = cards.getCardByName(playerData.card.name);
							}
							playerOne.invis = playerData.invis;
							playerOne.guard = playerData.guard;
							playerOne.stunned = playerData.stunned;
						}
						this.draw();
						board.resolveTurn();
					}.bind(this));
					return true;
				}
			}catch(e){
				console.log("some exception was thrown");
			}
			this.confirmNextTurnTimeout = setTimeout(this.getConfirmTurn(), 1000);
		}.bind(this));
	}.bind(this);
}
