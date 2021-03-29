/*
File: pacman.js

A Pac-Man clone

*/


// TODO
// ghost fright flash?
// inbox bouncing?
// pause game?

const HEIGHT = 864;
const WIDTH = 672;
const CELLSIZE = 24;
const MAXSPEED = 240 / 60;	// 240 pixels (10 tiles) per second

const Directions = Object.freeze({
    UP:   	1,
    DOWN:  	2,
    LEFT: 	3,
    RIGHT: 	4
});

bGameOver = false;
highScore = 0;


/* Helper functions */

function getDistance(p1, p2){
	return sqrt(sq(p1.x - p2.x) + sq(p1.y - p2.y));
}

function nextTile(curI, curJ, dir){
	newPos = {i: curI, j: curJ}
	if(dir == Directions.UP){
		newPos.i--;
	}
	else if(dir == Directions.DOWN){
		newPos.i++;
	}
	else if(dir == Directions.LEFT){
		newPos.j--;
	}
	else{
		newPos.j++;
	}

	return newPos;
}

function nearCenterOfTile(actor){
	return abs(Math.floor(actor.x) - (actor.j*CELLSIZE + 12)) < 4 && abs(Math.floor(actor.y) - (actor.i*CELLSIZE + 12)) < 4;
}

function getCenterOfTile(i, j){
	return {x: j*CELLSIZE + 12, y: i*CELLSIZE + 12};
}

function posToTile(pos){
	return Math.floor(pos / CELLSIZE);
}

function canTurnUp(i,j){
	if((j ==12 || j == 15) && (i == 26 || i == 14)){
		return false;
	}

	return true;
}

function opposite(dir){
	if(dir == Directions.UP){
		return Directions.DOWN;
	}
	else if(dir == Directions.DOWN){
		return Directions.UP;
	}
	else if(dir == Directions.LEFT){
		return Directions.RIGHT;
	}
	else{
		return Directions.LEFT;
	}
}

function lostLife(){
	if(bLifeLost){
		return;
	}
	lives--;
	bLifeLost = true;
}

function pause(){

}

function restartGame(){
	lives = 5;
	score = 0;
	bGameOver = false;
	bLifeLost = false;
	curLevel = 1;
	level = new Level();
	pacman = new Pacman();
	blinky = new Ghost("red", 0);
	pinky = new Ghost("pink", 0);
	inky = new Ghost("cyan", 30);
	clyde = new Ghost("orange", 60);
	fruit = null;
	time = 0;

	beginningSound.play();
	startPause = true;

	clear();
	background(backgroundImg);
	level.draw();
	pacman.draw();
	blinky.draw();
	pinky.draw();
	inky.draw();
	clyde.draw();

	stroke("yellow");
	fill("yellow");
	textSize(30);
	textAlign(CENTER, TOP);
	text("READY!", WIDTH/2, HEIGHT / 2 + 48);
	stroke("white");
	fill("white");

	loop();
}


/* Classes */

class Level{
	constructor(){
		this.grid = []
		for(let i = 0; i < levelGrid.length; i++){
			this.grid.push([]);
			for(let j = 0; j < levelGrid[0].length; j++){
				this.grid[i].push(levelGrid[i][j]);
			}
		}

		this.rows = levelGrid.length;
		this.cols = levelGrid[0].length;
		this.dotsLeft = 244;
		this.lastDotTimer = 0;
		this.lastDotTimeLimit = 210; // 3.5 seconds
		this.globalDotCounter = 0;
		this.globalDotCounterEnabled = false;
		this.ghostsEaten = 0;
		this.fruit1Taken = false;
		this.fruit2Taken = false;

		switch(curLevel){
			case 1:
				this.fruitScore = 100;
				this.fruitImg = cherryImg;
				break;
			case 2:
				this.fruitScore = 300;
				this.fruitImg = strawberryImg;
				break;
			case 3:
			case 4:
				this.fruitScore = 500;
				this.fruitImg = orangeImg;
				break;
			case 5:
			case 6:
				this.fruitScore = 700;
				this.fruitImg = appleImg;
				break;
			case 7:
			case 8:
				this.fruitScore = 1000;
				this.fruitImg = melonImg;
				break;
			case 9:
			case 10:
				this.fruitScore = 2000;
				this.fruitImg = bossImg;
				break;
			case 11:
			case 12:
				this.fruitScore = 3000;
				this.fruitImg = bellImg;
				break;
			default:
				this.fruitScore = 5000;
				this.fruitImg = keyImg;
		}


		if(curLevel == 1){
			this.pacMaxSpeed = 0.8 * MAXSPEED;
			this.pacFrightSpeed = 0.9 * MAXSPEED;
			this.ghostMaxSpeed = 0.70 * MAXSPEED;
			this.ghostFrightSpeed = 0.45 * MAXSPEED;
			this.ghostTunnelSpeed = 0.35 * MAXSPEED;
			this.elroy1Speed = 0.75 * MAXSPEED;
			this.elroy2Speed = 0.8 * MAXSPEED;
			this.elroy1DotsLeft = 20;
			this.frightTime = 360; // 6 seconds
			this.modePeriods = [7*60, 20*60, 7*60, 20*60, 5*60, 20*60, 5*60];
		}
		else if(curLevel < 5){
			this.pacMaxSpeed = 0.9 * MAXSPEED;
			this.pacFrightSpeed = 0.95 * MAXSPEED;
			this.ghostMaxSpeed = 0.8 * MAXSPEED;
			this.ghostFrightSpeed = 0.5 * MAXSPEED;
			this.ghostTunnelSpeed = 0.4 * MAXSPEED;
			this.elroy1Speed = 0.85 * MAXSPEED;
			this.elroy2Speed = 0.9 * MAXSPEED;
			this.elroy1DotsLeft = 40;
			this.frightTime = 240; // 4 seconds
			this.modePeriods = [7*60, 20*60, 7*60, 20*60, 5*60, 1033*60, 1];
		}
		else if(curLevel < 21){
			this.pacMaxSpeed = MAXSPEED;
			this.pacFrightSpeed = MAXSPEED;
			this.ghostMaxSpeed = 0.9 * MAXSPEED;
			this.ghostFrightSpeed = 0.55 * MAXSPEED;
			this.ghostTunnelSpeed = 0.45 * MAXSPEED;
			this.elroy1Speed = 0.95 *MAXSPEED;
			this.elroy2Speed = MAXSPEED;
			this.modePeriods = [5*60, 20*60, 5*60, 20*60, 5*60, 1037*60, 1];
			switch(curLevel){
				case 6:
				case 10:
					this.frightTime = 300; // 5 seconds
					break;
				case 14:
					this.frightTime = 180; // 3 seconds
					break;
				case 5:
				case 7:
				case 8:
				case 11:
					this.frightTime = 120; // 2 seconds
					break;
				default:
					this.frightTime = 60; // 1 second
			}
			switch(curLevel){
				case 5:
					this.elroy1DotsLeft = 40;
					break;
				case 6:
				case 7:
				case 8:
					this.elroy1DotsLeft = 50;
					break;
				case 9:
				case 10:
				case 11:
					this.elroy1DotsLeft = 60;
					break;
				case 12:
				case 13:
				case 14:
					this.elroy1DotsLeft = 80;
					break;
				case 15:
				case 16:
				case 17:
				case 18:
					this.elroy1DotsLeft = 100;
					break;
				default:
					this.elroy1DotsLeft = 120;

			}
		}
		else{
			this.pacMaxSpeed = 0.9 * MAXSPEED;
			this.ghostMaxSpeed = 0.9 * MAXSPEED;
			this.ghostTunnelSpeed = 0.45 * MAXSPEED;
			this.elroy1Speed = 0.95 *MAXSPEED;
			this.elroy2Speed = MAXSPEED;
			this.elroy1DotsLeft = 120;
			this.frightTime = 0;
			this.modePeriods = [5*60, 20*60, 5*60, 20*60, 5*60, 1037*60, 1];
		}
		this.elroy2DotsLeft = 0.5 * this.elroy1DotsLeft;
	}

	spawnFruit(){
		fruit = new Fruit();
	}

	draw(){
		for(let i=0; i < this.rows; i++){
			for(let j=0; j < this.cols; j++){
				if(this.grid[i][j] == 1){
					point(j*CELLSIZE + CELLSIZE / 2, i*CELLSIZE + CELLSIZE / 2);
				}
				else if(this.grid[i][j] == 2){
					if(time % 20 > 10){
						circle(j*CELLSIZE + CELLSIZE / 2, i*CELLSIZE + CELLSIZE / 2, CELLSIZE)
					}
				}
			}
		}
	}
}

class Fruit{
	constructor(){
		this.x = WIDTH/2 - 12;
		this.y = 20*CELLSIZE;
		this.timer = random(9*60, 10*60);
	}

	draw(){
		image(level.fruitImg, this.x, this.y);
		this.timer--;
	}
}

class Pacman{
	constructor(){
		this.x = WIDTH / 2;
		this.y = 26*CELLSIZE + 12;
		this.i = posToTile(this.y);
		this.j = posToTile(this.x);
		this.direction = Directions.LEFT;
		this.speedX = -level.pacMaxSpeed;
		this.speedY = 0;
		this.hasPowerUp = false;
		this.powerupTimer = 0;
	}

	setDirection(dir){
		this.direction = dir;
	}

	moveUp(){
		if(!nearCenterOfTile(this) || level.grid[this.i-1][this.j] > -1){
			this.speedX = 0;
			if(this.hasPowerUp){
				this.speedY = -level.pacFrightSpeed;
			}
			else{
				this.speedY = -level.pacMaxSpeed;
			}
		}
		else{
			let newPos = getCenterOfTile(pacman.i, pacman.j);
			this.x = newPos.x;
			this.y = newPos.y;
			this.speedX = 0;
			this.speedY = 0;
		}
	}

	moveDown(){
		if(!nearCenterOfTile(this) || level.grid[this.i+1][this.j] > -1){
			this.speedX = 0;
			if(this.hasPowerUp){
				this.speedY = level.pacFrightSpeed;
			}
			else{
				this.speedY = level.pacMaxSpeed;
			}
		}
		else{
			let newPos = getCenterOfTile(pacman.i, pacman.j);
			this.x = newPos.x;
			this.y = newPos.y;
			this.speedX = 0;
			this.speedY = 0;
		}
	}

	moveLeft(){
		if(this.j == 0){
			if(this.hasPowerUp){
				this.speedX = -level.pacFrightSpeed;
			}
			else{
				this.speedX = -level.pacMaxSpeed;
			}
			this.speedY = 0;
		}
		else if(!nearCenterOfTile(this) || level.grid[this.i][this.j-1] > -1){
			if(this.hasPowerUp){
				this.speedX = -level.pacFrightSpeed;
			}
			else{
				this.speedX = -level.pacMaxSpeed;
			}
			this.speedY = 0;
		}
		else{
			let newPos = getCenterOfTile(pacman.i, pacman.j);
			this.x = newPos.x;
			this.y = newPos.y;
			this.speedX = 0;
			this.speedY = 0;
		}
	}
	
	moveRight(){
		if(this.j == level.cols - 1){
			if(this.hasPowerUp){
				this.speedX = level.pacFrightSpeed;
			}
			else{
				this.speedX = level.pacMaxSpeed;
			}
			this.speedY = 0;
		}
		else if(!nearCenterOfTile(this) || level.grid[this.i][this.j+1] > -1){
			if(this.hasPowerUp){
				this.speedX = level.pacFrightSpeed;
			}
			else{
				this.speedX = level.pacMaxSpeed;
			}
			this.speedY = 0;
		}
		else{
			let newPos = getCenterOfTile(pacman.i, pacman.j);
			this.x = newPos.x;
			this.y = newPos.y;
			this.speedX = 0;
			this.speedY = 0;
		}
	}

	eatPowerup(){
		this.hasPowerUp = true;
		this.powerupTimer = level.frightTime;
	}

	eat(){
		let res = false;
		let curCell = level.grid[this.i][this.j];
		let pelletScore = 0;

		if(curCell == 1 || curCell == 2){
			pelletScore = 10;
			level.dotsLeft--;
			level.lastDotTimer = 0;
			if(!munchSound.isPlaying()){
				munchSound.play();
			}
			res = true;

			if(level.globalDotCounterEnabled){
				level.globalDotCounter++;

				if(level.globalDotCounter == 7){
					pinky.inBox = false;
				}
				if(level.globalDotCounter == 17){
					inky.inBox = false;
				}
				if(clyde.inBox && level.globalDotCounter == 32){
					level.globalDotCounterEnabled = false;
					level.globalDotCounter = 0;
				}
			}
			else{
				if(pinky.inBox){
					pinky.dotCounter++;
				}
				else if(inky.inBox){
					inky.dotCounter++;
				}
				else if(clyde.inBox){
					clyde.dotCounter++;
				}
			}
		}
		if(curCell == 2){
			pelletScore += 40;
			level.ghostsEaten = 0;
			this.eatPowerup();

			siren1SoundLoop.stop();
			siren2SoundLoop.stop();
			siren3SoundLoop.stop();
			siren4SoundLoop.stop();
			siren5SoundLoop.stop();
			frightSoundLoop.loop();
		}

		score += pelletScore;
		level.grid[this.i][this.j] = 0;

		return res;
	}

	updateMovement(){
		switch(this.direction){
			case Directions.UP:
				this.moveUp();
				break;
			case Directions.DOWN:
				this.moveDown();
				break;
			case Directions.LEFT:
				this.moveLeft();
				break;
			case Directions.RIGHT:
				this.moveRight();
		}
	}

	draw(){
		this.updateMovement();


		if(!this.eat()){
			this.x += this.speedX;
			this.y += this.speedY;

			if(this.x < 1){
				this.x = WIDTH + this.x;
			}
			else if(this.x >= WIDTH){
				this.x = this.x - WIDTH;
			}

			this.i = posToTile(this.y);
			this.j = posToTile(this.x);
		}

		if(this.hasPowerUp){
			if(this.powerupTimer == 0){
				this.hasPowerUp = false;
				frightSoundLoop.stop();
			}
			else{
				this.powerupTimer--;
			}
		}

		if((this.speedX !=0 || this.speedY != 0) && time % 10 > 5){
			image(pacmanImg, this.x - 12, this.y - 12);
		}
		else{
			switch(this.direction){
				//up
				case 1:
					image(pacmanImgUp, this.x - 12, this.y - 12);
					break;
				//down
				case 2:
					image(pacmanImgDown, this.x - 12, this.y - 12);
					break;
				//left
				case 3:
					image(pacmanImgLeft, this.x - 12, this.y - 12);
					break;
				//right
				case 4:
					image(pacmanImgRight, this.x - 12, this.y - 12);
					break;
			}
		}
		
		
	}
}

class Ghost{
	constructor(color, limit){
		this.speedX = -level.ghostMaxSpeed;
		this.speedY = 0;
		this.direction = Directions.LEFT;
		this.nextDir = null;
		this.tileToTurn = null;
		this.isEaten = false;
		this.color = color;
		this.curModeCounter = 0;
		this.curModeTimeLeft = level.modePeriods[0];
		this.dotCounter = 0;
		this.dotLimit = limit;
		this.inBox = true;

		let allTransitions = new WeakMap();

		let startState = new State(startStateFun, this);
		let wanderState = new State(wanderStateFun, this);
		let chaseState = null;
		if(color == "red"){
			chaseState = new State(blinkyChase, this);
			this.x = WIDTH/2;
			this.y = 14*CELLSIZE + 12;
			this.i = posToTile(this.y);
			this.j = posToTile(this.x);
			this.startJ = this.j;
			this.targetI = 0;
			this.targetJ = level.cols - 3;
		}
		else if(color == "pink"){
			chaseState = new State(pinkyChase, this);
			this.x = WIDTH / 2;
			this.y = 17*CELLSIZE + 12;
			this.i = posToTile(this.y);
			this.j = posToTile(this.x);
			this.startJ = this.j;
			this.targetI = 0;
			this.targetJ = 2;
		}
		else if(color == "cyan"){
			chaseState = new State(inkyChase, this);
			this.x = WIDTH/2 - 48;
			this.y = 17*CELLSIZE + 12;
			this.i = posToTile(this.y);
			this.j = posToTile(this.x);
			this.startJ = this.j;
			this.targetI = level.rows - 3;
			this.targetJ = level.cols -1;
		}
		else{
			chaseState = new State(clydeChase, this);
			this.x = WIDTH/2 + 48;
			this.y = 17*CELLSIZE + 12;
			this.i = posToTile(this.y);
			this.j = posToTile(this.x);
			this.startJ = this.j;
			this.targetI = this.rows - 3;
			this.targetJ = 0;
		}
		let fleeState = new State(fleeStateFun, this);
		let eatenState = new State(eatenStateFun, this);
		let allStates = [startState, wanderState, chaseState, fleeState, eatenState];

		allTransitions.set(startState, [new StateTransition(startToWander, this, startState, wanderState)]);
		allTransitions.set(wanderState, [new StateTransition(wanderToChase, this, wanderState, chaseState),
										new StateTransition(fleeTransition, this, wanderState, fleeState)]);
		allTransitions.set(chaseState, [new StateTransition(chaseToWander, this, chaseState, wanderState),
										new StateTransition(fleeTransition, this, chaseState, fleeState)]);
		allTransitions.set(fleeState, [new StateTransition(fleeToWander, this, fleeState, wanderState),
										new StateTransition(fleeToChase, this, fleeState, chaseState),
										new StateTransition(fleeToEaten, this, fleeState, eatenState)]);
		allTransitions.set(eatenState, [new StateTransition(eatenToStart, this, eatenState, startState)]);
		

		this.AI = new StateMachine(allStates, allTransitions);
	}

	moveToTarget(tarI, tarJ){
		// if new mode and near wall
		if(this.nextDir == null && this.tileToTurn == null){
			let nxTile = nextTile(this.i, this.j, this.direction);
			let shortestDistance = null;
			let nxDir = null;

			if(level.grid[nxTile.i][nxTile.j] == -1){
				// choose and set new direction
				//up
				if(this.direction != Directions.DOWN && this.direction != Directions.UP && canTurnUp(this.i, this.j)){
					let dist = getDistance(getCenterOfTile(this.i-1, this.j), getCenterOfTile(tarI, tarJ));
					
					shortestDistance = dist;
					nxDir = Directions.UP;
				}
				//left
				if(this.direction != Directions.RIGHT && this.direction != Directions.LEFT){
					let dist = getDistance(getCenterOfTile(this.i, this.j-1), getCenterOfTile(tarI, tarJ));
					if(shortestDistance == null || dist < shortestDistance){
						shortestDistance = dist;
						nxDir = Directions.LEFT;
					}
				}
				//down
				if(this.direction != Directions.UP && this.direction != Directions.DOWN){
					let dist = getDistance(getCenterOfTile(this.i+1, this.j), getCenterOfTile(tarI, tarJ));
					if(dist < shortestDistance){
						shortestDistance = dist;
						nxDir = Directions.DOWN;
					}
				}
				//right
				if(this.direction != Directions.LEFT && this.direction != Directions.RIGHT ){
					let dist = getDistance(getCenterOfTile(this.i, this.j+1), getCenterOfTile(tarI, tarJ));
					if(dist < shortestDistance){
						shortestDistance = dist;
						nxDir = Directions.RIGHT;
					}
				}
				this.nextDir = nxDir;
				this.tileToTurn = {i: this.i, j: this.j};
			}
		}

		//check if stepped into new tile
		if(posToTile(this.y) != this.i || posToTile(this.x) != this.j){
			this.i = posToTile(this.y);
			this.j = posToTile(this.x);

			let lookahead = null;
			//lookahead
			if(this.nextDir == null){
				lookahead = nextTile(this.i, this.j, this.direction);
			}
			else{
				lookahead = nextTile(this.i, this.j, this.nextDir);
			}
			let shortestDistance = null;
			let nxDir = null;
			
			//if option to move, calculate distance / option and set new direction
			//up
			if(this.direction != Directions.DOWN && level.grid[lookahead.i-1][lookahead.j] > -1 && canTurnUp(lookahead.i, lookahead.j)){
				let dist = getDistance(getCenterOfTile(lookahead.i-1, lookahead.j), getCenterOfTile(tarI, tarJ));

				shortestDistance = dist;
				nxDir = Directions.UP;
			}
			//left
			if(this.direction != Directions.RIGHT && level.grid[lookahead.i][lookahead.j-1] > -1){
				let dist = getDistance(getCenterOfTile(lookahead.i, lookahead.j-1), getCenterOfTile(tarI, tarJ));
				if(shortestDistance == null || dist < shortestDistance){
					shortestDistance = dist;
					nxDir = Directions.LEFT;
				}
			}
			//down
			if(this.direction != Directions.UP && level.grid[lookahead.i+1][lookahead.j] > -1){
				let dist = getDistance(getCenterOfTile(lookahead.i+1, lookahead.j), getCenterOfTile(tarI, tarJ));
				if(shortestDistance == null || dist < shortestDistance){
					shortestDistance = dist;
					nxDir = Directions.DOWN;
				}
			}
			//right
			if(this.direction != Directions.LEFT && level.grid[lookahead.i][lookahead.j+1] > -1){
				let dist = getDistance(getCenterOfTile(lookahead.i, lookahead.j+1), getCenterOfTile(tarI, tarJ));
				if(shortestDistance == null || dist < shortestDistance){
					shortestDistance = dist;
					nxDir = Directions.RIGHT;
				}
			}
			
			if(this.tileToTurn == null && nxDir != this.direction){
				this.tileToTurn = lookahead;
				this.nextDir = nxDir;	
			}
		}
		// if we need to turn
		else if(this.tileToTurn != null && this.nextDir != this.direction && this.i == this.tileToTurn.i && this.j == this.tileToTurn.j && nearCenterOfTile(this)){
			let newPos = getCenterOfTile(this.i, this.j);
			this.x = newPos.x;
			this.y = newPos.y;
			this.direction = this.nextDir;
			this.tileToTurn = null;
			this.nextDir = null;
			
			switch(this.direction){
				case 1:
					//up
					this.speedX = 0;
					if(this.isEaten){
						this.speedY = -MAXSPEED;
					}
					else{
						this.speedY = -level.ghostMaxSpeed;
					}
					break;
				case 2:
					//down
					this.speedX = 0;
					if(this.isEaten){
						this.speedY = MAXSPEED;
					}
					else{
						this.speedY = level.ghostMaxSpeed;
					}
					break;
				case 3:
					//left
					this.speedY = 0;
					if(this.isEaten){
						this.speedX = -MAXSPEED;
					}
					else{
						this.speedX = -level.ghostMaxSpeed;
					}
					break;
				case 4:
					//right
					this.speedY = 0;
					if(this.isEaten){
						this.speedX = MAXSPEED;
					}
					else{
						this.speedX = level.ghostMaxSpeed;
					}
			}
		}

		//update pos
		if(level.grid[this.i][this.j] == 3){
			this.x += (this.speedX == 0)? 0 : (this.speedX > 0)? level.ghostTunnelSpeed : -level.ghostTunnelSpeed;
			this.y += (this.speedY == 0)? 0 : (this.speedY > 0)? level.ghostTunnelSpeed : -level.ghostTunnelSpeed;
		}
		else if(this == blinky){
			if(level.dotsLeft <= level.elroy2DotsLeft){
				this.x += (this.speedX == 0)? 0 : (this.speedX > 0)? level.elroy2Speed : -level.elroy2Speed;
				this.y += (this.speedY == 0)? 0 : (this.speedY > 0)? level.elroy2Speed : -level.elroy2Speed;
			}
			else if(level.dotsLeft <= level.elroy1DotsLeft) {
				this.x += (this.speedX == 0)? 0 : (this.speedX > 0)? level.elroy1Speed : -level.elroy1Speed;
				this.y += (this.speedY == 0)? 0 : (this.speedY > 0)? level.elroy1Speed : -level.elroy1Speed;
			}
			else{
				this.x += this.speedX;
				this.y += this.speedY;
			}
		}
		else{
			this.x += this.speedX;
			this.y += this.speedY;
		}

		if(this.x < 1){
			this.x = WIDTH + this.x;
		}
		else if(this.x >= WIDTH){
			this.x = this.x - WIDTH;
		}

	}

	draw(){
		this.AI.update();

		if(this.i == pacman.i && this.j == pacman.j && !this.isEaten){
			if(pacman.hasPowerUp){
				this.isEaten = true;
				eatGhostSound.play();
			}
			else{
				lostLife();
			}
		}

		if(this.isEaten){
			image(ghostEatenImg, this.x-12, this.y-12);
		}
		else if(pacman.hasPowerUp){
			image(ghostFleeImg, this.x -12, this.y -12);
		}
		else{
			if(this == blinky){
				image(blinkyImg, this.x-12, this.y-12);
			}
			else if(this == pinky){
				image(pinkyImg, this.x-12, this.y-12);
			}
			else if(this == inky){
				image(inkyImg, this.x-12, this.y-12);
			}
			else{
				image(clydeImg, this.x-12, this.y-12);
			}
		}
	}
}


/* Input functions */

function keyPressed(){
	if(bGameOver){
		if(keyCode == ENTER){
			restartGame();
		}
	}

	switch(keyCode){
		case ENTER:
			pause();
			break;
			
		case UP_ARROW:
			if(pacman.direction != Directions.UP && level.grid[pacman.i-1][pacman.j] != -1){
				if(pacman.direction == Directions.LEFT || pacman.direction == Directions.RIGHT){
					let newPos = getCenterOfTile(pacman.i, pacman.j);
					pacman.x = newPos.x;
					pacman.y = newPos.y;
				}
				pacman.setDirection(Directions.UP);
				// pacman.updateMovement();
			}
			break;

		case DOWN_ARROW:
			if(pacman.direction != Directions.DOWN && level.grid[pacman.i+1][pacman.j] != -1){
				if(pacman.direction == Directions.LEFT || pacman.direction == Directions.RIGHT){
					let newPos = getCenterOfTile(pacman.i, pacman.j);
					pacman.x = newPos.x;
					pacman.y = newPos.y;
				}
				pacman.setDirection(Directions.DOWN);
				// pacman.updateMovement();
			}
			break;

		case LEFT_ARROW:
			if(pacman.direction != Directions.LEFT && level.grid[pacman.i][pacman.j-1] != -1){
				if(pacman.direction == Directions.UP || pacman.direction == Directions.DOWN){
					let newPos = getCenterOfTile(pacman.i, pacman.j);
					pacman.x = newPos.x;
					pacman.y = newPos.y;
				}
				pacman.setDirection(Directions.LEFT);
				// pacman.updateMovement();
			}
			break;

		case RIGHT_ARROW:
			if(pacman.direction != Directions.RIGHT && level.grid[pacman.i][pacman.j+1] != -1){
				if(pacman.direction == Directions.UP || pacman.direction == Directions.DOWN){
					let newPos = getCenterOfTile(pacman.i, pacman.j);
					pacman.x = newPos.x;
					pacman.y = newPos.y;
				}
				pacman.setDirection(Directions.RIGHT);
				// pacman.updateMovement();
			}
	}
}


/* Initializing functions */

function preload(){
	backgroundImg = loadImage('assets/background.PNG');
	pacmanImg = loadImage('assets/pacman.png');
	pacmanImgRight = loadImage('assets/pacmanRight.png');
	pacmanImgLeft = loadImage('assets/pacmanLeft.png');
	pacmanImgUp = loadImage('assets/pacmanUp.png');
	pacmanImgDown = loadImage('assets/pacmanDown.png');
	ghostEatenImg = loadImage('assets/ghostEaten.png');
	ghostFleeImg = loadImage('assets/ghostScared.png');
	// ghostFleeFlashImg = loadImage('assets/ghostScaredFlash.png');
	blinkyImg = loadImage('assets/blinky.png');
	pinkyImg = loadImage('assets/pinky.png');
	inkyImg = loadImage('assets/inky.png');
	clydeImg = loadImage('assets/clyde.png');
	cherryImg = loadImage('assets/cherry.png');
	strawberryImg = loadImage('assets/strawberry.png');
	orangeImg = loadImage('assets/orange.png');
	appleImg = loadImage('assets/apple.png');
	melonImg = loadImage('assets/melon.png');
	bossImg = loadImage('assets/boss.png');
	bellImg = loadImage('assets/bell.png');
	keyImg = loadImage('assets/key.png');

	beginningSound = loadSound('sound/beginning.wav');
	deathSound = loadSound('sound/death.wav');
	eatFruitSound = loadSound('sound/eatfruit.wav');
	eatGhostSound = loadSound('sound/eatghost.wav');
	munchSound = loadSound('sound/munch.wav');
	frightSoundLoop = loadSound('sound/power_pellet.wav');
	eatenSoundLoop = loadSound('sound/retreating.wav');
	siren1SoundLoop = loadSound('sound/siren_1.wav');
	siren2SoundLoop = loadSound('sound/siren_2.wav');
	siren3SoundLoop = loadSound('sound/siren_3.wav');
	siren4SoundLoop = loadSound('sound/siren_4.wav');
	siren5SoundLoop = loadSound('sound/siren_5.wav');
}


function setup() {
	createCanvas(WIDTH, HEIGHT);
	strokeWeight(2);
	stroke("white");
	fill("white");
	
	lives = 5;
	score = 0;
	bLifeLost = false;
	curLevel = 1;
	level = new Level();
	pacman = new Pacman();
	blinky = new Ghost("red", 0);
	pinky = new Ghost("pink", 0);
	inky = new Ghost("cyan", 30);
	clyde = new Ghost("orange", 60);
	fruit = null;
	time = 0;
	startPause = true;
	newStartTime = 0;

	// scoreP = createP("Score: " + score.toString()).style('color', '#000').style('font-size', '32pt').style('grid-area', 'p1');
	// livesP = createP("Lives: " + lives.toString()).style('color', '#000').style('font-size', '32pt').style('grid-area', 'p2');
	// levelP = createP("Level: " + curLevel.toString()).style('color', '#000').style('font-size', '32pt').style('grid-area', 'p3');

	beginningSound.play();
	background(backgroundImg);
	level.draw();
	pacman.draw();
	blinky.draw();
	pinky.draw();
	inky.draw();
	clyde.draw();
	stroke("yellow");
	fill("yellow");
	textSize(30);
	textAlign(CENTER, TOP);
	text("READY!", WIDTH/2, HEIGHT / 2 + 48);
	stroke("white");
	fill("white");
}


/* Draw function */

function draw() {
	if(startPause){
		if(millis() - newStartTime > 4000){
			startPause = false;
		}
		else{
			return;
		}
	}

	clear();
	background(backgroundImg);

	if(blinky.inBox){
		blinky.inBox = false;
	}
	if(pinky.inBox && !level.globalDotCounterEnabled && pinky.dotCounter >= pinky.dotLimit){
		pinky.inBox = false;
	}
	if(inky.inBox && !level.globalDotCounterEnabled && inky.dotCounter >= inky.dotLimit){
		inky.inBox = false;
	}
	if(clyde.inBox && !level.globalDotCounterEnabled && clyde.dotCounter >= clyde.dotLimit){
		clyde.inBox = false;
	}

	if(level.lastDotTimer > level.lastDotTimeLimit){
		if(pinky.inBox){
			pinky.inBox = false;
		}
		else if(inky.inBox){
			inky.inBox = false;
		}
		else if(clyde.inBox){
			clyde.inBox = false;
		}
		level.lastDotTimer = 0;
	}

	level.draw();
	pacman.draw();
	blinky.draw();
	pinky.draw();
	inky.draw();
	clyde.draw();

	if(fruit != null){
		if(fruit.timer < 0){
			fruit = null;
		}
		else if((pacman.i == posToTile(fruit.y) && (pacman.j == posToTile(fruit.x)))){
			fruit = null;
			score += level.fruitScore;
			eatFruitSound.play();
		}
		else{
			fruit.draw();
		} 
	}
	
	time++;
	level.lastDotTimer++;

	if(eatenSoundLoop.isLooping() && !blinky.isEaten && !pinky.isEaten && !inky.isEaten && !clyde.isEaten){
		eatenSoundLoop.stop();
		if(pacman.hasPowerUp){
			frightSoundLoop.loop();
		}
	}

	if(!pacman.hasPowerUp){
		if(level.dotsLeft > 192){
			if(!siren1SoundLoop.isLooping()){
				siren1SoundLoop.loop();
			}
		}
		else if(level.dotsLeft > 144){
			if(!siren2SoundLoop.isLooping()){
				siren1SoundLoop.stop();
				siren2SoundLoop.loop();
			}
		}
		else if(level.dotsLeft > 96){
			if(!siren3SoundLoop.isLooping()){
				siren2SoundLoop.stop();
				siren3SoundLoop.loop();
			}
		}
		else if(level.dotsLeft > 48){
			if(!siren4SoundLoop.isLooping()){
				siren3SoundLoop.stop();
				siren4SoundLoop.loop();
			}
		}
		else{
			if(!siren5SoundLoop.isLooping()){
				siren4SoundLoop.stop();
				siren5SoundLoop.loop();
			}
		}
	}

	if(level.dotsLeft == 174 && !level.fruit1Taken){
		level.spawnFruit();
	}
	else if(level.dotsLeft == 74 && !level.fruit2Taken){
		level.spawnFruit();
	}
	else if(level.dotsLeft == 0){
		curLevel++;
		pacman = new Pacman();
		level = new Level();
		blinky = new Ghost("red", 0);
		pinky = new Ghost("pink", 0);
		if(curLevel ==2){
			inky = new Ghost("cyan", 0);
			clyde = new Ghost("orange", 50);
		}
		else{
			inky = new Ghost("cyan", 0);
			clyde = new Ghost("orange", 0);
		}
		time = 0;

		frightSoundLoop.stop();
		eatenSoundLoop.stop();
		siren5SoundLoop.stop();

		startPause = true;
		newStartTime = millis();

		clear();
		background(backgroundImg);
		level.draw();
		pacman.draw();
		blinky.draw();
		pinky.draw();
		inky.draw();
		clyde.draw();

		stroke("yellow");
		fill("yellow");
		textSize(30);
		textAlign(CENTER, TOP);
		text("READY!", WIDTH/2, HEIGHT / 2 + 48);
		stroke("white");
		fill("white");
	}

	if(bLifeLost){
		bLifeLost = false;

		frightSoundLoop.stop();
		eatenSoundLoop.stop();
		siren1SoundLoop.stop();
		siren2SoundLoop.stop();
		siren3SoundLoop.stop();
		siren4SoundLoop.stop();
		siren5SoundLoop.stop();
		deathSound.play();

		if(lives < 0){
			bGameOver = true;
			noLoop();
			stroke("red");
			fill("red");
			textSize(40);
			text("GAME OVER", WIDTH / 2, HEIGHT / 2 - 40);
			textSize(30);
			text("Press Enter key to play again", WIDTH / 2, HEIGHT / 2 + 50);
			stroke("white");
			fill("white");
		}
		else{
			level.globalDotCounterEnabled = true;
			level.globalDotCounter = 0;
			
			pacman = new Pacman();
			
			let ghosts = [blinky, pinky, inky, clyde];
			for(let i = 0; i < 4; i++){
				let prevModeCounter = ghosts[i].curModeCounter;
				let prevDotCounter = ghosts[i].dotCounter;
				let prevLimit = ghosts[i].dotLimit;
				let prevColor = ghosts[i].color;
				
				ghosts[i] = new Ghost(prevColor, prevLimit);
				
				ghosts[i].curModeCounter = prevModeCounter;
				ghosts[i].dotCounter = prevDotCounter;
				ghosts[i].curModeTimeLeft = (ghosts[i].curModeCounter == level.modePeriods.length)? Number.MAX_VALUE : level.modePeriods[ghosts[i].curModeCounter];
				
				if(i == 0){
					blinky = ghosts[i];
				}
				else if(i == 1){
					pinky = ghosts[i];
				}
				else if(i == 2){
					inky = ghosts[i];
				}
				else{
					clyde = ghosts[i];
				}
			}
			
			startPause = true;
			newStartTime = millis();

			clear();
			background(backgroundImg);
			level.draw();
			pacman.draw();
			blinky.draw();
			pinky.draw();
			inky.draw();
			clyde.draw();
			stroke("yellow");
			fill("yellow");
			textSize(30);
			textAlign(CENTER, TOP);
			text("READY!", WIDTH/2, HEIGHT / 2 + 48);
			stroke("white");
			fill("white");
		}
	}

	highScore = Math.max(highScore, score);


	textSize(35);
	textAlign(CENTER, TOP);
	text('HIGH SCORE', WIDTH / 2, 5);
	text(highScore.toString(), WIDTH / 2, 40);
	text(score.toString(), 120, 40);
	text(curLevel.toString(), WIDTH/2, HEIGHT - 40);

	for(let i =0; i < lives; i++){
		image(pacmanImgLeft, 50 + i*30, HEIGHT - CELLSIZE);
	}
	image(level.fruitImg, WIDTH - 75, HEIGHT - CELLSIZE)
}