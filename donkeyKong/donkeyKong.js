/*
File: donkeyKong.js

A Donkey Kong arcade game clone

*/


//TODO play around with barrelspeed and other constants
const HEIGHT = 768;
const WIDTH = 672;
const BEAMWIDTH = 24;
const MARIOSPEED = 100;
const BARRELSPEED = 120;
const JUMPSTRENGTH = 180;
const GRAVITY = 400; // og = 150

bGameOver = false;
bLifeLost = false;
score = 0;
highScore = 0;


// TODO
// - tweak mario climbing half ladders behavior
// - keep Mario from jumping between sets of beams
// - tweak collisions, specifically spark
// - apply logic to spark's and barrel's use of ladders
// - ensure sparks can move between beams but can't fall from them.
// - ensure falls, fire over oil barrel, 0 bonus kill mario
// - win condition
// - jump over enemies grants points!!!
// - scoring
// - restart game


/* Helper functions */

function isThereCollision(obj1, obj2){
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
	// lives = 5;
	// score = 0;
	// bGameOver = false;
	// bLifeLost = false;
	// time = 0;

	// clear();
	// background(backgroundImg);

	// loop();
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
		let hammers = [new Hammer(504, 573), new Hammer(48, 291)];

		super(1, 168, mario, beams, ladders, 4500, backgroundLevelOneImg);

		this.hammers = hammers;
		this.barrels = [];
		this.sparks = [];
		this.lastBarrelSpawn = millis();

		//TODO remove
		this.lastSparkSpawn = millis();
	}

	checkWin(){
		if(this.mario.y + this.mario.h <= this.goal){
			return true;
		}

		return false;
	}
	resetLevel(){
		this.mario = new Mario(50, HEIGHT - 3 * BEAMWIDTH);
		this.sparks = [];
		this.barrels = [];
		this.hammers = [new Hammer(504, 573), new Hammer(48, 291)];;
		this.bonus = this.initialBonus;
		this.lastBarrelSpawn = millis();
	}

	draw(){
		clear();
		background(this.background);

		//spawn barrel
		if(millis() - this.lastBarrelSpawn >= 2000){
			this.barrels.push(new Barrel());
			this.lastBarrelSpawn = millis();
		}
		
		//TODO remove
		if(millis() - this.lastSparkSpawn >= 5000 && this.sparks.length < 5){
			this.sparks.push(new Spark());
			this.lastSparkSpawn = millis();
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
			if(barrel.x + barrel.w < 0 || barrel.x > WIDTH){
				this.barrels.splice(i, 1);
				break;
			}
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
		this.isGrounded = false;
	}

	isOnTop(obj){
		if(obj instanceof Beam){
			var isBetweenX = this.x + this.w / 2 >= obj.x && this.x + this.w / 2 <= obj.x + obj.w;
			var isBetweenY = this.y + this.h >= obj.y && this.y + this.h < obj.y + BEAMWIDTH;
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

		//DEBUG
		this.initY = y;
		this.maxY = HEIGHT;
		this.lastX = 0;
		this.maxX = 0;
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
				// if(this.isOnTopOfLadder()){
				// 	this.onLadder = false;
				// }
				// else{
					this.velY = -MARIOSPEED;
				// }
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
		if(!this.onLadder){
			// beams
			for(let beam of level.beams){
				if(this.isOnTop(beam)){
					//DEBUG
					if(this.isJumping){
						var dX = this.x - this.lastX;
						if(dX > this.maxX){
							this.maxX = dX;
						}
					}

					this.isGrounded = true;
					this.isJumping = false;

					break;
				}
			}

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

		if(level.level == 1){
			// barrels
			for(let barrel of level.barrels){
				if(isThereCollision(this, barrel)){
					lostLife();
					return;
				}
			}
		}

		// TODO spark
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
		this.isGrounded = false;
		
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
				}
			}
			//if below bottom:
			else if(this.y + this.h >= this.ladderClimbing.y2){
				// return y to min position
				this.y = this.ladderClimbing.y2 - this.h;
				// if on ground, ladder reference = null, onladder = false
				this.ladderClimbing = null;
				this.onLadder = false;
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

		push();
		// strokeWeight(3);
		stroke("blue");
		fill("red");
		square(this.x, this.y, this.h);
		pop();
	}
}

// TODO first barrel rolls sraight through
// TODO Except if blue: if barrel below Mario go out of bounds (don't reverse). Then kill.
class Barrel extends BasePhysicsActor{
	constructor(first=false, crazy=false, blue=false){
		super(200, 222, 36, 30);
		this.first = first;
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

	checkCollision(){
		// rolling on a beam or falling
		if(!this.onLadder){
			//check for ground / beam collision
			for(let beam of level.beams){
				if(this.isOnTop(beam)){
					this.isGrounded = true;
					if(this.isFalling){
						this.isFalling = false;
						this.direction *= -1;
					}
					//check if we can go down a ladder
					for(let ladder of level.ladders){
						if(this.isOnTop(ladder)){
							this.x = ladder.x1 + (BEAMWIDTH - this.w) / 2;
							this.onLadder = true;
							this.isGrounded = false;
							this.ladderDescending = ladder;
							return;
						}
					}
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
			this.velX = MARIOSPEED * this.direction;
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

		if(this.ladderDescending){
			image(barrelSideImg, this.x - 6, this.y)
		}
		else{
			image(barrelTopImg, this.x, this.y)
		}
		// rect(this.x, this.y, this.w, this.h, 4);
	}
}

//TODO cannot fall from ledge
//TODO only spawn from blue barrels?
// TODO max number of fireballs at once?
class Spark extends BasePhysicsActor{
	constructor(){
		super(100, HEIGHT - BEAMWIDTH * 2, BEAMWIDTH, BEAMWIDTH);
		this.onLadder = false;
		this.ladderClimbing = null;
	}

	checkCollision(){
		if(!this.onLadder){
			// collision with beam
			// for(let beam of level.beams){
			// 	if(this.isOnTop(beam)){
			// 		break;
			// 	}
			// }

			for(let ladder of level.ladders){
				//TODO make more rare
				if(this.isOnBottom(ladder)){
					if(level.mario.y < this.y - BEAMWIDTH){
						this.x = ladder.x1 + (BEAMWIDTH - this.w) / 2;
						this.onLadder = true;
						this.ladderClimbing = ladder;
						this.velY = -MARIOSPEED;
						this.velX = 0;
					}
				}
				else if(this.isOnTop(ladder)){
					if(level.mario.y > this.y - BEAMWIDTH){
						this.x = ladder.x1 + (BEAMWIDTH - this.w) / 2;
						this.onLadder = true;
						this.ladderClimbing = ladder;
						this.velY = MARIOSPEED;
						this.velX = 0;
					}
				}
			}
		}
		else{
			if(this.y + this.h <= this.ladderClimbing.y1){
				//return y to max position.
				this.y = this.ladderClimbing.y1 - this.h;
				// If on ground, ladder reference = null, onladder = false,
				this.ladderClimbing = null;
				this.onLadder = false;
				this.velY = 0;
			}
			//if below bottom:
			else if(this.y + this.h >= this.ladderClimbing.y2){
				// return y to min position
				this.y = this.ladderClimbing.y2 - this.h;
				// if on ground, ladder reference = null, onladder = false
				this.ladderClimbing = null;
				this.onLadder = false;
				this.velY = 0;
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

		if(this.x < 0){
			this.x = 0;
			this.velX = MARIOSPEED;
		}
		else if(this.x > WIDTH -this.w){
			this.x = WIDTH - this.w;
			this.velX = -MARIOSPEED;
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
					level.barrels.splice(i, 1)
					return;
				}
			}
		}

		for(let [i, spark] of level.sparks.entries()){
			if(isThereCollision(this, spark)){
				level.sparks.splice(i, 1)
				return;
			}
		}
	}

	updatePosition(){
		//TODO fix values based on mario's direction

		//hammer up
		//TODO tweak
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
		//TODO tweak rotation?
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

// TODO mario can't fully climb half-ladders
class Ladder{
	constructor(x1, y1, y2, isHalf=false){
		this.x1 = x1;
		this.x2 = x1 + BEAMWIDTH;
		this.y1 = y1;
		this.y2 = y2;
		this.isHalf = isHalf;
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
	sparkLeftImg = loadImage("assets/spark-beta-left.gif");
	sparkRightImg = loadImage("assets/spark-beta-right.gif");
	hammerImg = loadImage("assets/hammer.png");
	barrelSideImg = loadImage("assets/barrel_side.gif")
	barrelTopImg = loadImage("assets/barrel_top.gif")
}


function setup() {
	createCanvas(WIDTH, HEIGHT);
	strokeWeight(2);
	stroke("white");
	fill("white");
	
	lives = 2;
	time = 0;
	nextSecond = 1000;
	startPause = false;
	newStartTime = 0;
	
	level = new LevelOne();

	//TODO remove DEBUG
	// level.barrels = [new Barrel()];
	// level.sparks = [new Spark()];
}


/* Draw function */

function draw() {
	if(startPause){
		if(millis() - newStartTime > 4000){
			level.resetLevel();
			time = 0;
			nextSecond = 1000;
			startPause = false;
		}
		else{
			return;
		}
	}

	level.draw();

	// handle mario being hit
	if(bLifeLost){
		bLifeLost = false;

		if(lives < 0){
			bGameOver = true;
			lives = 0;
			noLoop();
			stroke("white");
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
		stroke("white");
		fill("white");
		textSize(40);
		text("YOU WON!", WIDTH / 2, HEIGHT / 2 - 40);
		textSize(30);
		text("Press Enter key to play again", WIDTH / 2, HEIGHT / 2 + 50);
		stroke("white");
		fill("white");
	}

	// PRINT SCORE INFO
	time+= deltaTime;
	if(level.bonus > 0 && time > nextSecond){
		level.bonus -= 100;
		nextSecond += 1000;
	}
	highScore = Math.max(highScore, score);
	textSize(35);
	textAlign(CENTER, TOP);
	text('HIGH SCORE', WIDTH / 2, 5);
	text(highScore.toString(), WIDTH / 2, 40);
	text(score.toString(), 120, 5);
	text(lives.toString(), 120, 40);
	text('LEVEL ' + level.level.toString(), WIDTH - 120, 5);
	text('BONUS:', WIDTH - 120, 40);
	text(level.bonus.toString(), WIDTH - 120, 75);
}