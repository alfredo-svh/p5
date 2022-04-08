/*
File: donkeyKong.js

A Donkey Kong arcade game clone

*/


const HEIGHT = 768;
const WIDTH = 672;
const BEAMWIDTH = 24;
const MARIOSPEED = 110;
const BARRELSPEED = 180;
const JUMPSTRENGTH = 300; // og 180
// const GRAVITY = 400; // og = 150
const GRAVITY = 1000; // og = 150

bGameOver = false;
bLifeLost = false;
score = 0;
highScore = 0;


// TODO
// - finish graphics: mario (chapulin), donkey kong (cuajinais), heart
// - ensure donkey kong kills mario
// - add sound
// - new levels??


/* Helper functions */

function isThereCollision(obj1, obj2){
	if(obj1 instanceof Mario){
		if(obj1.x + obj1.w  - 12 > obj2.x && obj1.x + 12 < obj2.x + obj2.w && obj1.y + obj1.h > obj2.y && obj1.y < obj2.y + obj2.h){
			return true;
		}
		return false;
	}

	if(obj1.x + obj1.w > obj2.x && obj1.x < obj2.x + obj2.w && obj1.y + obj1.h > obj2.y && obj1.y < obj2.y + obj2.h){
		return true;
	}
	return false;
}

function lostLife(){
	if(bLifeLost){
		return;
	}
	lives--;
	bLifeLost = true;
}

function restartGame(){
	lives = 2;
	startPause = false;
	newStartTime = 0;
	score = 0;
	extraLifeAwarded = false;
	
	level = new LevelOne();

	loop();
}


/* Classes */

class Level{
	constructor(level, goal, mario, beams, ladders, bonus, background){
		this.level = level;
		this.goal = goal;
		this.mario = mario;
		this.beams = beams;
		this.ladders = ladders;
		this.initialBonus = bonus;
		this.bonus = bonus;
		this.background = background;
	}

	checkWin(){
	}

	resetLevel(){
		this.bonus = this.initialBonus;
	}

	draw(){
		clear();
		background(this.background);
	
		this.mario.draw();
	}
}

class LevelOne extends Level{
	constructor(){
		let mario = new Mario(200, HEIGHT - 3 * BEAMWIDTH);
		let beams = [new Beam(0, 744, 336), new Beam(336, 741), new Beam(384, 738), new Beam(432, 735), new Beam(480, 732), new Beam(528, 729), new Beam(576, 726), new Beam(624, 723),
					 new Beam(0, 624), new Beam(48, 627), new Beam(96, 630), new Beam(144, 633), new Beam(192, 636), new Beam(240, 639), new Beam(288, 642), new Beam(336, 645), new Beam(384, 648), new Beam(432, 651), new Beam(480, 654), new Beam(528, 657), new Beam(576, 660),
					 new Beam(48, 561), new Beam(96, 558), new Beam(144, 555), new Beam(192, 552), new Beam(240, 549), new Beam(288, 546), new Beam(336, 543), new Beam(384, 540), new Beam(432, 537), new Beam(480, 534), new Beam(528, 531), new Beam(576, 528), new Beam(624, 525),
					 new Beam(0, 426), new Beam(48, 429), new Beam(96, 432), new Beam(144, 435), new Beam(192, 438), new Beam(240, 441), new Beam(288, 444), new Beam(336, 447), new Beam(384, 450), new Beam(432, 453), new Beam(480, 456), new Beam(528, 459), new Beam(576, 462),
					 new Beam(48, 363), new Beam(96, 360), new Beam(144, 357), new Beam(192, 354), new Beam(240, 351), new Beam(288, 348), new Beam(336, 345), new Beam(384, 342), new Beam(432, 339), new Beam(480, 336), new Beam(528, 333), new Beam(576, 330), new Beam(624, 327),
					 new Beam(0, 252, 432), new Beam(432, 255), new Beam(480, 258), new Beam(528, 261), new Beam(576, 264), new Beam(264, 168, 144)
		];
		let ladders = [new Ladder(240, 639, 744, true), new Ladder(552, 657, 729), new Ladder(96, 558, 630), new Ladder(288, 546, 642), new Ladder(192, 438, 552, true),
					   new Ladder(336, 447, 543), new Ladder(552, 459, 531), new Ladder(96, 360, 432), new Ladder(216, 354, 438), new Ladder(504, 336, 456, true),
					   new Ladder(264, 252, 351, true), new Ladder(552, 261, 333), new Ladder(384, 168, 252)];

		super(1, 168, mario, beams, ladders, 5000, backgroundLevelOneImg);

		this.hammers = [new Hammer(504, 573), new Hammer(48, 285)];
		this.barrels = [];
		this.sparks = [];
		this.lastBarrelSpawn = millis();
		this.barrelsThrown = 0;
		this.fire = null;
	}

	checkWin(){
		if(this.mario.y + this.mario.h <= this.goal){
			return true;
		}

		return false;
	}
	resetLevel(){
		this.mario = new Mario(200, HEIGHT - 3 * BEAMWIDTH);
		this.sparks = [];
		this.barrels = [];
		this.hammers = [new Hammer(504, 573), new Hammer(48, 291)];;
		this.bonus = this.initialBonus;
		this.lastBarrelSpawn = millis();
		this.barrelsThrown = 0;
		this.fire = null;
	}

	draw(){
		clear();
		background(this.background);

		image(mininaImg, 264, 102);

		// If barrelsTThrown = 0: send first barrel down.
		if(this.barrelsThrown == 0){
			this.barrels.push(new FirstBarrel());
			this.barrelsThrown++;
		}

		//spawn barrel
		if(millis() - this.lastBarrelSpawn >= 2000){
			if(this.barrelsThrown % 8 == 0 && this.sparks.length < 5){
				this.barrels.push(new Barrel(false, true));
			}
			else{
				this.barrels.push(new Barrel());
			}
			this.lastBarrelSpawn = millis();
			this.barrelsThrown++;
		}

	
		for(let barrel of this.barrels){
			barrel.draw();
		}
		
		
		for(let spark of this.sparks){
			spark.draw();
		}
		
		for(let hammer of this.hammers){
			hammer.draw();
		}
		
		this.mario.draw();
		
		// Delete barrels
		for(let i=0; i < this.barrels.length; i++){
			let barrel = this.barrels[i];
			if(barrel.y + barrel.h >= HEIGHT - BEAMWIDTH && barrel.x <= 96){
				if(barrel.blue && this.sparks.length < 5){
					this.sparks.push(new Spark());
				}
				this.barrels.splice(i, 1);
				break;
			}
			if(barrel.x + barrel.w < 0 || barrel.x > WIDTH){
				this.barrels.splice(i, 1);
				break;
			}
		}

		if(this.fire == null && this.sparks.length > 0){
			this.fire = new Fire();
		}
		if(this.fire){
			this.fire.draw();
		}
	}
}

class BasePhysicsActor{
	constructor(x, y, w, h){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.velX = 0;
		this.velY = 0;
		this.isGrounded = true;
	}

	isOnTop(obj){
		if(obj instanceof Beam){
			let x = this.x + this.w / 2
			var isBetweenX = x >= obj.x && x <= obj.x + obj.w;
			var isBetweenY = this.y + this.h >= obj.y - 3 && this.y + this.h < obj.y + BEAMWIDTH;

			// Avoid Mario jumping into beam above
			if(this instanceof Mario){
				var isBetweenY = this.y + this.h >= obj.y - 3 && this.y + this.h < obj.y + BEAMWIDTH / 2;
			}

			if (isBetweenX && isBetweenY){
				this.y = obj.y - this.h;
				return true;
			}
		}
		else if(obj instanceof Ladder){
			if(this.y + this.h == obj.y1 && this.x > obj.x1 - BEAMWIDTH && this.x + this.w < obj.x2 + BEAMWIDTH){
				return true;
			}
		}
		return false;
	}

	isOnBottom(obj){
		if(obj instanceof Ladder){
			if(this.y + this.h == obj.y2 && this.x > obj.x1 - BEAMWIDTH && this.x + this.w < obj.x2 + BEAMWIDTH){
				
				return true;
			}
		}
		return false;
	}

	checkCollision(){

	}

	updatePosition(){
		this.checkCollision();
		this.x += this.velX * deltaTime / 1000;
		this.y += this.velY * deltaTime / 1000;
	}

	draw(){
		this.updatePosition();
		rect(this.x, this.y, this.w, this.h);
	}
}

//TODO should jump up to 36 pixels high, 48 pixels long, and for 45 frames
// current max height = 34 pixels
// current jump len = 136 pixels
class Mario extends BasePhysicsActor{
	constructor(x, y){
		// x and y refer to the position of the top left corner of Mario's sprite
		super(x, y, BEAMWIDTH * 2, BEAMWIDTH * 2);
		this.isJumping = false;
		this.onLadder = false;
		this.ladderClimbing = null;
		this.hasHammer = false;
		this.hammerHeld = null;
		this.facingLeft = true;
		this.jumpedOver = false;

		//DEBUG
		this.initY = y;
		this.maxY = HEIGHT;
		this.lastX = 0;
		this.maxX = 0;
	}

	didJumpOver(){
		if (this.jumpedOver){
			return false;
		}

		// let scanArea = {x: this.x+9, y: this.y + this.h, w: 30, h: 36};
		// if(this.velX == 0){
		// 	scanArea = {x: this.x-26, y: this.y + this.h, w: 100, h: 36}
		// }

		let numberOfBarrelsJumped = 0;
	
		for(let barrel of level.barrels){
			if(this.x + this.w > barrel.x && this.x < barrel.x + barrel.w && this.y + 2 * this.h > barrel.y && this.y < barrel.y + barrel.h){
				numberOfBarrelsJumped++;
			}
		}
		
		if(numberOfBarrelsJumped > 0){
			switch(numberOfBarrelsJumped){
				case 1:
					score += 100;
					break;
				case 2:
					score += 300;
					break;
				default:
					score += 500;
			}
			this.jumpedOver = true;
			return true;
		}
		
		for(let spark of level.sparks){
			if(this.x + this.w > spark.x && this.x < spark.x + spark.w && this.y + 2 * this.h > spark.y && this.y < spark.y + spark.h){
				score += 100;
				this.jumpedOver = true;
				return true;
			}
		}
	
		return false;
	}

	// we use this function to know if we can start climbing up a ladder
	isOnBottom(obj){
		if(obj instanceof Ladder){
			if(this.y + this.h == obj.y2 && this.x > obj.x1 - BEAMWIDTH && this.x + this.w < obj.x2 + BEAMWIDTH){
				this.x = obj.x1 - BEAMWIDTH / 2;
				this.ladderClimbing = obj;
				return true;
			}
		}
		return false;
	}
	
	isOnTopOfLadder(){
		for(let ladder of level.ladders){
			if(this.isOnTop(ladder)){
				this.x = ladder.x1 + (BEAMWIDTH - this.w) / 2;
				this.ladderClimbing = ladder;
				return true;
			}
		}
		return false;
	}

	isOnBottomOfLadder(){
		for(let ladder of level.ladders){
			if(this.isOnBottom(ladder)){
				return true;
			}
		}
		return false;
	}

	handleInput(){
		if(keyIsDown(RIGHT_ARROW) && !this.onLadder && !this.isJumping){
			this.facingLeft = false;
			this.velX = MARIOSPEED;
		}
		
		if(keyIsDown(LEFT_ARROW) && !this.onLadder && !this.isJumping){
			this.facingLeft = true;
			this.velX = -MARIOSPEED;
		}

		if(keyIsDown(UP_ARROW) && !this.hasHammer){
			if(this.onLadder){
				if(this.ladderClimbing.isHalf && this.y <= this.ladderClimbing.y1 + BEAMWIDTH){
					this.velY = 0;
				}
				else{
					this.velY = -MARIOSPEED;
				}
			}
			else if(this.isGrounded && this.isOnBottomOfLadder()){
				this.onLadder = true;
				this.velY = -MARIOSPEED;
				this.isGrounded = false;
			}
		}

		if(keyIsDown(DOWN_ARROW) && !this.hasHammer){
			if(this.onLadder){
				// if(this.isOnBottomOfLadder()){
				// 	this.onLadder = false;
				// }
				// else{
					this.velY = MARIOSPEED;
				// }
			}
			else if(this.isGrounded && this.isOnTopOfLadder()){
				this.onLadder = true;
				this.velY = MARIOSPEED;
				this.isGrounded = false;
			}
		}
	
		// spacebar = jump
		if(keyIsDown(32) && !this.isJumping && !this.onLadder  && !this.hasHammer){
			//DEBUG 
			this.lastX = this.x;

			this.isJumping = true;
			this.isGrounded = false;
			this.velY = -JUMPSTRENGTH;
		}
	}

	checkCollision(){
		let grounded = false;
		if(!this.onLadder){
			// beams
			for(let beam of level.beams){
				if(this.isOnTop(beam)){
					//DEBUG
					// if(this.isJumping){
					// 	var dX = this.x - this.lastX;
					// 	if(dX > this.maxX){
					// 		this.maxX = dX;
					// 	}
					// } // DEBUG

					if(!this.isJumping && !this.isGrounded){
						lostLife();
						return;
					}

					grounded = true;
					this.isJumping = false;
					this.jumpedOver = false;

					break;
				}
			}

			this.isGrounded = grounded;

			//hammer
			if(!this.hasHammer){
				for(let hammer of level.hammers){
					if(isThereCollision(this, hammer)){
						this.hasHammer = true;
						this.hammerHeld = hammer;
						hammer.isHeld = true;
						hammer.timeout = millis() + 10000;
					}
	
				}
			}
		}

		if(this.isJumping && this.velY >= 0){
			this.didJumpOver();
		}

		if(level.level == 1){
			// barrels
			for(let barrel of level.barrels){
				if(isThereCollision(this, barrel)){
					lostLife();
					return;
				}
			}

			if(level.fire){
				if(isThereCollision(this, level.fire)){
					lostLife();
					return;
				}
			}
		}

		//sparks
		for(let spark of level.sparks){
			if(isThereCollision(this, spark)){
				lostLife();
				return;
			}
		}

	}

	updatePosition(){
		if(this.hasHammer && millis() > this.hammerHeld.timeout){
			for(let [i, hammer] of level.hammers.entries()){
				if(this.hammerHeld == hammer){
					level.hammers.splice(i, 1)
					break;
				}
			}
			this.hasHammer = false;
			this.hammerHeld = null;
		}

		if(!this.isJumping){
			this.velX = 0;
		}
		
		if(!this.onLadder){
			this.velY += GRAVITY * deltaTime / 1000;
		}
		else{
			this.velY = 0;
		}
		// this.isGrounded = false;
		
		this.checkCollision();
		this.handleInput();

		if(this.isGrounded){
			this.velY = 0;
		}

		this.x += this.velX * deltaTime / 1000;
		this.y += this.velY * deltaTime / 1000;
		
		if(this.onLadder){
			//if above top:
			if(this.y + this.h <= this.ladderClimbing.y1){
				//return y to max position.
				this.y = this.ladderClimbing.y1 - this.h;
				// If on ground, ladder reference = null, onladder = false,
				if(!this.ladderClimbing.isHalf){
					this.ladderClimbing = null;
					this.onLadder = false;
					this.isGrounded = true;
				}
			}
			//if below bottom:
			else if(this.y + this.h >= this.ladderClimbing.y2){
				// return y to min position
				this.y = this.ladderClimbing.y2 - this.h;
				// if on ground, ladder reference = null, onladder = false
				this.ladderClimbing = null;
				this.onLadder = false;
				this.isGrounded = true;
			}
		}
		
		if(this.x < 0){
			this.x = 0;
		}
		if(this.x + this.w > WIDTH){
			this.x = WIDTH - this.w;
		}
	}
	
	draw(){
		this.updatePosition();

		//DEBUG
		// if(this.y < this.maxY){
		// 	this.maxY = this.y;
		// }
		// console.log(this.initY - this.maxY);
		// console.log(this.maxX);

		if(this.facingLeft){
			image(chapulinImg, this.x, this.y);
		}
		else{
			image(chapulinRightImg, this.x, this.y);
		}
		// push();
		// // strokeWeight(3);
		// stroke("blue");
		// fill("red");
		// square(this.x, this.y, this.h);
		// pop();
	}
}

class Barrel extends BasePhysicsActor{
	constructor(crazy=false, blue=false, x = 200, y = 222){
		super(x, y, 36, 30);
		this.crazy = crazy;
		this.blue = blue;
		this.onLadder = false;
		this.ladderDescending = null;
		this.isFalling = false;
		this.direction = 1;
	}

	isOnBottom(){
		if(this.y + this.h >= this.ladderDescending.y2){
			return true;
		}
		return false;
	}

	shouldTakeLadder(){
		

		if(keyIsDown(LEFT_ARROW) && this.x < level.mario.x){
			return true;
		}

		if(keyIsDown(RIGHT_ARROW) && this.x > level.mario.x){
			return true;
		}
		return false;
	}

	checkCollision(){
		// rolling on a beam or falling
		if(!this.onLadder){
			//check for ground / beam collision
			for(let beam of level.beams){
				if(this.isOnTop(beam)){
					this.isGrounded = true;
					if(this.isFalling){
						this.isFalling = false;

						// if below mario, roll out
						if(this.blue || this.y + this.h <= level.mario.y + level.mario.h){
							this.direction *= -1;
						}
						return;
					}
					//check if we can go down a ladder
					for(let ladder of level.ladders){
						if(this.isOnTop(ladder)){
							if(this.ladderDescending){
								return;
							}

							this.ladderDescending = ladder;

							// Should barrel take down ladder
							let marioY = level.mario.y + level.mario.h;
							let barrelY = this.y + this.h;
							let maxDiffPerHorizontalLevel = 39;
							if(marioY <= barrelY || marioY - barrelY <= maxDiffPerHorizontalLevel){
								return;
							}
							
							if(this.shouldTakeLadder()){
								if(Math.random() < 0.75){
									this.x = ladder.x1 + (BEAMWIDTH - this.w) / 2;
									this.onLadder = true;
									this.isGrounded = false;
								}
							}
							else if(Math.random() < 0.25){
								this.x = ladder.x1 + (BEAMWIDTH - this.w) / 2;
								this.onLadder = true;
								this.isGrounded = false;
							}
							return;
						}
					}
					this.ladderDescending = null;
					return;
				}
			}
			this.isFalling = true;
		}
		// rolling down a ladder
		else{
			if(this.isOnBottom()){
				this.y = this.ladderDescending.y2 - this.h;
				this.onLadder = false;
				this.isGrounded = true;
				this.ladderDescending = null;
				this.direction *= -1;
			}
		}
	}

	updatePosition(){
		this.velY += GRAVITY * deltaTime / 1000;
		this.isGrounded = false;
		
		this.checkCollision();

		if(this.isGrounded){
			this.velX = BARRELSPEED * this.direction;
			this.velY = 0;
		}
		else if(this.onLadder){
			this.velX = 0;
			this.velY = MARIOSPEED;
		}
		else{ // falling
			this.velX = MARIOSPEED * this.direction;
		}

		this.x += this.velX * deltaTime / 1000;
		this.y += this.velY * deltaTime / 1000;
	}

	draw(){
		this.updatePosition();

		if(this.onLadder){
			if(this.blue){
				image(barrelBlueSideImg, this.x - 6, this.y);
			}
			else{
				image(barrelSideImg, this.x - 6, this.y);
			}
		}
		else{
			if(this.blue){
				image(barrelBlueTopImg, this.x, this.y);
			}
			else{
				image(barrelTopImg, this.x, this.y);
			}
		}
		// rect(this.x, this.y, this.w, this.h, 4);
	}
}

class FirstBarrel extends Barrel{
	constructor(){
		super(false, true, 120, 222);
		this.isFalling = true;
		this.direction = 0;
	}

	checkCollision(){
		if(this.isOnTop(level.beams[0])){
			this.isGrounded = true;
			this.isFalling = false;
			this.direction = -1;
		}
	}

	draw(){
		this.updatePosition();

		if(this.isGrounded){
			image(barrelBlueTopImg, this.x - 6, this.y)
		}
		else{
			image(barrelBlueSideImg , this.x, this.y)
		}
	}
}

class Spark extends BasePhysicsActor{
	constructor(){
		super(100, HEIGHT - BEAMWIDTH * 2, BEAMWIDTH, BEAMWIDTH);
		this.onLadder = false;
		this.ladderClimbing = null;
		this.currentBeamIndex = 0;
	}

	checkCollision(){
		if(!this.onLadder){
			for(let ladder of level.ladders){
				if(this.isOnBottom(ladder)){
					if(this.ladderClimbing){
						return;
					}
					this.ladderClimbing = ladder;
					if(Math.random() < 0.2){
						this.x = ladder.x1 + (BEAMWIDTH - this.w) / 2;
						this.onLadder = true;
						this.velY = -MARIOSPEED;
						this.velX = 0;
					}
					return;
				}
				else if(this.isOnTop(ladder)){
					if(level.mario.y + level.mario.h > this.y + this.h){
						if(this.ladderClimbing){
							return;
						}
						this.ladderClimbing = ladder;
						if(Math.random() < 0.2){
							this.x = ladder.x1 + (BEAMWIDTH - this.w) / 2;
							this.onLadder = true;
							this.velY = MARIOSPEED;
							this.velX = 0;
						}
						return;
					}
				}
			}
			this.ladderClimbing = null;
		}
		else{
			if(this.y + this.h <= this.ladderClimbing.y1){
				//return y to max position.
				this.y = this.ladderClimbing.y1 - this.h;
				// If on ground, ladder reference = null, onladder = false,
				// this.ladderClimbing = null;
				this.onLadder = false;
				this.velY = 0;
				this.setBeam(true);
			}
			//if below bottom:
			else if(this.y + this.h >= this.ladderClimbing.y2){
				// return y to min position
				this.y = this.ladderClimbing.y2 - this.h;
				// if on ground, ladder reference = null, onladder = false
				// this.ladderClimbing = null;
				this.onLadder = false;
				this.velY = 0;
				this.setBeam(true);
			}
		}
	}
	
	isOnBeam(beamIndex){
		if(beamIndex < 0 || beamIndex >= level.beams.length){
			return false;
		}

		let beam = level.beams[beamIndex];
		let x = this.x + (this.w / 2);
		if(x >= beam.x && x <= beam.x + beam.w){
			this.currentBeamIndex = beamIndex;
			this.y = beam.y - this.h;
			return true;
		}
		return false;
	}

	setBeam(afterLadder=false){
		if(afterLadder){
			for(let i =0; i < level.beams.length; i++){
				if(this.isOnTop(level.beams[i])){
					this.currentBeamIndex = i;
					return;
				}
			}
		}

		// if we are not on a beam, we fell. We have to go back to the previous one
		if(!(this.isOnBeam(this.currentBeamIndex) ||
			 this.isOnBeam(this.currentBeamIndex+1) ||
			 this.isOnBeam(this.currentBeamIndex-1))){

			let beam = level.beams[this.currentBeamIndex]
			if(this.x < beam.x){
				this.x = beam.x - (this.w / 2);
				this.velX = MARIOSPEED;
			}
			else{
				this.x = beam.x + beam.w - (this.w / 2);
				this.velX = -MARIOSPEED;
			}
		}
	}

	move(){
		let rand = Math.random();
		if(this.velX == 0){
			this.velX = MARIOSPEED;
			if(rand > 0.5){
				this.velX = -MARIOSPEED;
			}
		}
		else{
			if(rand > 0.993){
				this.velX = -this.velX;
			}
		}
	}
	
	updatePosition(){
		this.checkCollision();

		if(!this.onLadder){
			this.move();
		}

		this.x += this.velX * deltaTime / 1000;
		this.y += this.velY * deltaTime / 1000;

		if(!this.onLadder){
			this.setBeam()
		}

		if(this.x < 0){
			this.x = 0;
			this.velX = MARIOSPEED;
		}
		else if(this.x > WIDTH -this.w){
			this.x = WIDTH - this.w;
			this.velX = -MARIOSPEED;
		}
	}


	draw(){
		this.updatePosition();

		// sparkImg.pause();
		if(this.velX > 0){
			image(sparkRightImg, this.x - 12, this.y - BEAMWIDTH);
		}
		else{
			image(sparkLeftImg, this.x - 12, this.y - BEAMWIDTH);
		}
		// sparkImg.setFrame(0);

		// push();
		// // strokeWeight(3);
		// stroke("orange");
		// fill("orange");
		// square(this.x, this.y, this.h);
		// pop();
	}
}

class Hammer{
	constructor(x, y){
		this.x = x;
		this.y = y;
		this.h = 30;
		this.w = 27;
		this.isHeld = false;
		this.isDown = false;
		this.timeout = 0;
	}

	checkCollision(){
		if(level.level == 1){
			for(let [i, barrel] of level.barrels.entries()){
				if(isThereCollision(this, barrel)){
					if(barrel.blue){
						let rand = Math.random();
						if(rand < 0.5){
							score += 500;
						}
						else if(rand < 0.75){
							score += 800;
						}
						else{
							score += 300;
						}
					}
					else{
						score += 300;
					}
					level.barrels.splice(i, 1);
					return;
				}
			}
		}

		for(let [i, spark] of level.sparks.entries()){
			if(isThereCollision(this, spark)){
				let rand = Math.random();
				if(rand < 0.5){
					score += 500;
				}
				else if(rand < 0.75){
					score += 800;
				}
				else{
					score += 300;
				}
				level.sparks.splice(i, 1);
				return;
			}
		}
	}

	updatePosition(){

		//hammer up
		if((millis() % 500) > 250){
			this.isDown = false;
			this.x = level.mario.x + 12;
			this.y = level.mario.y - this.h;
		}
		// hammer down
		else{
			this.isDown = true;
			this.y = level.mario.y;

			this.x = level.mario.x;
			if(level.mario.facingLeft){
				this.x -= this.w;
			}
			else{
				this.x += level.mario.w;
			}
		}
	}

	draw(){
		if(this.isHeld){
			this.updatePosition();
			this.checkCollision();
		}
		//TODO make mario hold it lower?
		if(this.isDown){
			push();
			if(level.mario.facingLeft){
				translate(this.x, this.y + this.h);
				rotate(PI / 2 * 135);
			}
			else{
				translate(this.x + this.w, this.y);
				rotate(PI / 2 * 45);
			}
			image(hammerImg, 0, 0);
			pop();
		}
		else{
			image(hammerImg, this.x, this.y);
		}
		// push();
		// strokeWeight(3);
		// fill('red');
		// rect(this.x, this.y, this.w, this.h);
		// pop();
	}
}

class Beam{
	constructor(x, y, w = 2 * BEAMWIDTH){
		this.x = x;
		this.y = y;
		this.w = w;
	}
}

class Ladder{
	constructor(x1, y1, y2, isHalf=false){
		this.x1 = x1;
		this.x2 = x1 + BEAMWIDTH;
		this.y1 = y1;
		this.y2 = y2;
		this.isHalf = isHalf;
	}
}

class Fire{
	constructor(){
		this.x = 51;
		this.y = 648;
		this.w = 48;
		this.h = 48;
	}

	draw(){
		image(fireImg, this.x, this.y);
	}
}



/* Input functions */

function keyPressed(){
	if(bGameOver && keyCode == ENTER){
		restartGame();
	}
}


/* Initializing functions */

function preload(){
	backgroundLevelOneImg = loadImage("assets/background.png");
	liveImg = loadImage("assets/live.png");
	fireImg = loadImage("assets/fire.gif");
	hammerImg = loadImage("assets/hammer.png");
	sparkLeftImg = loadImage("assets/spark-left.gif");
	sparkRightImg = loadImage("assets/spark-right.gif");
	barrelSideImg = loadImage("assets/barrel_side.gif");
	barrelBlueSideImg = loadImage("assets/barrel_side_blue.gif");
	barrelTopImg = loadImage("assets/barrel_top.gif");
	barrelBlueTopImg = loadImage("assets/barrel_top_blue.gif");
	chapulinImg = loadImage("assets/chapulin.png");
	chapulinRightImg = loadImage("assets/chapulin-right.png");
	mininaImg = loadImage("assets/minina.png");
}


function setup() {
	createCanvas(WIDTH, HEIGHT);
	strokeWeight(2);
	stroke("white");
	fill("white");
	
	bonusTimer = 0;
	lives = 2;
	startPause = false;
	newStartTime = 0;
	extraLifeAwarded = false;
	
	level = new LevelOne();
}


/* Draw function */

function draw() {
	if(startPause){
		if(millis() - newStartTime > 4000){
			level.resetLevel();
			startPause = false;
		}
		else{
			return;
		}
	}

	level.draw();

	if(millis() - bonusTimer >= 2000){
		bonusTimer = millis();
		level.bonus -= 100;

		if(level.bonus == 0){
			lostLife();
		}
	}

	// handle mario death
	if(bLifeLost){
		bLifeLost = false;

		if(lives < 0){
			bGameOver = true;
			lives = 0;
			noLoop();
			stroke("yellow");
			fill("white");
			textSize(40);
			text("GAME OVER", WIDTH / 2, HEIGHT / 2 - 40);
			textSize(30);
			text("Press Enter key to play again", WIDTH / 2, HEIGHT / 2 + 50);
			stroke("white");
			fill("white");
		}
		else{
			// restart level
			startPause = true;
			newStartTime = millis();
		}
	}
	else if(level.checkWin()){
		noLoop();
		bGameOver = true;
		score += level.bonus;
		stroke("yellow");
		fill("white");
		textSize(40);
		text("YOU WON!", WIDTH / 2, HEIGHT / 2 - 40);
		textSize(30);
		text("Press Enter key to play again", WIDTH / 2, HEIGHT / 2 + 50);
		stroke("white");
		fill("white");
	}

	if(score >=7000 && !extraLifeAwarded){
		lives++;
		extraLifeAwarded = true;
	}

	
	// PRINT SCORE INFO
	highScore = Math.max(highScore, score);
	textSize(35);
	textAlign(CENTER, TOP);
	text('HIGH SCORE', WIDTH / 2, 5);
	text(highScore.toString(), WIDTH / 2, 40);
	text(score.toString(), 120, 5);
	for(let i=0; i < lives; i++){
		image(liveImg, 80 + i* 28, 40);
	}
	text('LEVEL ' + level.level.toString(), WIDTH - 120, 5);
	text('BONUS:', WIDTH - 120, 40);
	text(level.bonus.toString(), WIDTH - 120, 75);
}