/*
File: AI.js

Classes and functions that dictate the ghost's AI behavior in Pacman

*/



/* Classes */

class State{
	constructor(func, data){
		this.func = func;
		this.data = data;
	}

	update(){
		if(this.func){
			this.func(this.data);
		}
	}
}

class StateTransition{
	constructor(func, data, srcState, dstState){
		this.func =  func;
		this.data =  data;
		this.sourceState = srcState;
		this.destinationState = dstState;
	}
	getSourceState(){
		return this.sourceState;
	}

	getDestinationState(){
		return this.destinationState;
	}

	canTransition(){
		if(this.func){
			return this.func(this.data);
		}
		return false;
	}
	
}

class StateMachine{
	constructor(allStates, allTransitions){
		this.allStates = allStates;
		this.allTransitions = allTransitions;
		this.activeState = this.allStates[0];
		this.lastState = null;
	}

	update(){
		if(this.activeState){
			this.activeState.update();
			this.out = this.activeState.out;

			let transitions = this.allTransitions.get(this.activeState);

			for(let i=0; i <  transitions.length; i++){
				if(transitions[i].canTransition()){
					this.lastState = this.activeState;
					this.activeState = transitions[i].getDestinationState();
					return;
				}
			}
		}
	}
}


/* State functions */

function startStateFun(thisGhost){
	if(thisGhost.inBox){
		return;
	}

	if(abs(thisGhost.x - WIDTH / 2) < 4){
		thisGhost.x = WIDTH / 2;
		thisGhost.y-=level.ghostMaxSpeed;
		thisGhost.i = posToTile(thisGhost.y);
	}else if(thisGhost.x < WIDTH / 2){
		thisGhost.x+=level.ghostMaxSpeed;
	}
	else{
		thisGhost.x-=level.ghostMaxSpeed;
	}
}

function wanderStateFun(thisGhost){
	thisGhost.moveToTarget(thisGhost.targetI, thisGhost.targetJ);
	thisGhost.curModeTimeLeft--;

}

function blinkyChase(thisGhost){
	thisGhost.moveToTarget(pacman.i, pacman.j);
	thisGhost.curModeTimeLeft--;

	//TODO elroy
}

function pinkyChase(thisGhost){
	let target = {i: pacman.i, j: pacman.j};

	for(let i=0; i < 4; i++){
		target = nextTile(target.i, target.j, pacman.direction);
	}
	thisGhost.moveToTarget(target.i, target.j);
	thisGhost.curModeTimeLeft--;
}

function inkyChase(thisGhost){
	let target = {i: pacman.i, j: pacman.j};

	for(let i=0; i < 2; i++){
		target = nextTile(target.i, target.j, pacman.direction);
	}

	target.i += target.i - blinky.i;
	target.j += target.j - blinky.j;

	thisGhost.moveToTarget(target.i, target.j);
	thisGhost.curModeTimeLeft--;
}

function clydeChase(thisGhost){
	if(getDistance({x: thisGhost.x, y: thisGhost.y}, {x: pacman.x, y: pacman.y}) < 8 * CELLSIZE){
		thisGhost.moveToTarget(thisGhost.targetI, thisGhost.targetJ);
	}
	else{
		thisGhost.moveToTarget(pacman.i, pacman.j);
	}
	thisGhost.curModeTimeLeft--;
}

function fleeStateFun(thisGhost){
	if(thisGhost.i != posToTile(thisGhost.y) || thisGhost.j != posToTile(thisGhost.x) ){
		thisGhost.i = posToTile(thisGhost.y);
		thisGhost.j = posToTile(thisGhost.x);
		thisGhost.tileToTurn = null;
	}

	if(nearCenterOfTile(thisGhost) && thisGhost.tileToTurn == null){
		let newPos = getCenterOfTile(thisGhost.i, thisGhost.j);
		let nextDir = random([1,2,3,4]);
		let nxTile = nextTile(thisGhost.i, thisGhost.j, nextDir);
		
		thisGhost.x = newPos.x;
		thisGhost.y = newPos.y;

		while(level.grid[nxTile.i][nxTile.j] < 0 || nextDir == opposite(thisGhost.direction)){
			nextDir = random([1,2,3,4]);
			nxTile = nextTile(thisGhost.i, thisGhost.j, nextDir);
		}
		thisGhost.direction = nextDir;

		thisGhost.tileToTurn = {i: thisGhost.i, j: thisGhost.j};
	}

	//UPDATE SPEED
	switch(thisGhost.direction){
		case 1:
			//up
			thisGhost.speedX = 0;
			thisGhost.speedY = -level.ghostFrightSpeed;
			break;
		case 2:
			//down
			thisGhost.speedX = 0;
			thisGhost.speedY = level.ghostFrightSpeed;
			break;
		case 3:
			//left
			thisGhost.speedX = -level.ghostFrightSpeed;
			thisGhost.speedY = 0;
			break;
		case 4:
			//right
			thisGhost.speedX = level.ghostFrightSpeed;
			thisGhost.speedY = 0;
	}

	//update pos
	if(level.grid[thisGhost.i][thisGhost.j] == 3){
		thisGhost.x += (thisGhost.speedX == 0)? 0 : (thisGhost.speedX > 0)? level.ghostTunnelSpeed : -level.ghostTunnelSpeed;
		thisGhost.y += (thisGhost.speedY == 0)? 0 : (thisGhost.speedY > 0)? level.ghostTunnelSpeed : -level.ghostTunnelSpeed;
	}
	else{
		thisGhost.x += thisGhost.speedX;
		thisGhost.y += thisGhost.speedY;
	}

	if(thisGhost.x < 1){
		thisGhost.x = WIDTH + thisGhost.x;
	}
	else if(thisGhost.x >= WIDTH){
		thisGhost.x = thisGhost.x - WIDTH;
	}

}

function eatenStateFun(thisGhost){

	if(thisGhost.j == 13 && thisGhost.i < 17 && thisGhost.i > 8){
		thisGhost.x = WIDTH / 2;
		thisGhost.y += MAXSPEED;
		thisGhost.i = posToTile(thisGhost.y);
	}
	else{
		thisGhost.moveToTarget(14, 13);
	}
}


/* Transition functions */

function startToWander(thisGhost){
	if(thisGhost.i == 14){
		thisGhost.y = 14*CELLSIZE + 12;
		thisGhost.nextDir = null;
		thisGhost.tileToTurn = null;

		return true;
	}
	return false;
}

function wanderToChase(thisGhost){
	if(thisGhost.curModeTimeLeft == 0){
		thisGhost.direction = opposite(thisGhost.direction);
		thisGhost.nextDir = null;
		thisGhost.tileToTurn = null;
		thisGhost.speedX = - thisGhost.speedX;
		thisGhost.speedY = - thisGhost.speedY;
		thisGhost.curModeCounter++;
		thisGhost.curModeTimeLeft = (thisGhost.curModeCounter == level.modePeriods.length)? Number.MAX_VALUE : level.modePeriods[thisGhost.curModeCounter];

		return true;
	}
	return false;
}

function chaseToWander(thisGhost){
	if(thisGhost.curModeCounter != level.modePeriods.length && thisGhost.curModeTimeLeft == 0){
		thisGhost.direction = opposite(thisGhost.direction);
		thisGhost.nextDir = null;
		thisGhost.tileToTurn = null;
		thisGhost.speedX = - thisGhost.speedX;
		thisGhost.speedY = - thisGhost.speedY;
		thisGhost.curModeCounter++;
		thisGhost.curModeTimeLeft = level.modePeriods[thisGhost.curModeCounter];

		return true;
	}
	return false;
}

function fleeTransition(thisGhost){
	if(pacman.hasPowerUp){
		thisGhost.direction = opposite(thisGhost.direction);
		thisGhost.speedX = - thisGhost.speedX;
		thisGhost.speedY = - thisGhost.speedY;
		thisGhost.nextDir = null;
		thisGhost.tileToTurn = null;

		return true;
	}

	return false;
}

function fleeToWander(thisGhost){
	if(!pacman.hasPowerUp && thisGhost.curModeCounter % 2 == 0 && thisGhost.curModeCounter != level.modePeriods.length){
		thisGhost.nextDir = null;
		thisGhost.tileToTurn = null;

		return true;
	}

	return false;
}

function fleeToChase(thisGhost){
	if(!pacman.hasPowerUp && (thisGhost.curModeCounter % 2 == 1 || thisGhost.curModeCounter != level.modePeriods.length)){
		thisGhost.nextDir = null;
		thisGhost.tileToTurn = null;
		
		return true;
	}

	return false;
}

function fleeToEaten(thisGhost){
	if(thisGhost.isEaten){
		level.ghostsEaten++;
		let points = 200;
		for(let i = 1;i <level.ghostsEaten;i++){
			points *= 2;
		}
		score += points;
		thisGhost.nextDir = null;
		thisGhost.tileToTurn = null;

		frightSoundLoop.stop();
		if(!eatenSoundLoop.isLooping()){
			eatenSoundLoop.loop();
		}

		return true;
	}

	return false;
}

function eatenToStart(thisGhost){
	if(thisGhost.i == 17 && thisGhost.j == thisGhost.startJ){
		thisGhost.isEaten = false;

		return true;
	}
	return false;
}