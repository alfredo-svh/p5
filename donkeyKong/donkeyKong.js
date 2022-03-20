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
highScore = 0;


// TODO
// - ensure mario can jump over enemies
// - apply logic to spark's and barrel's use of ladders
// - build level
// - win condition
// - tweak collisions
// - restart game
// - scoring


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
			var isBetweenX = this.x + this.w / 2 >= obj.x1 && this.x + this.w / 2 <= obj.x2;
			var isBetweenY = this.y + this.h >= obj.y1 && this.y + this.h < obj.y1 + BEAMWIDTH;
			if (isBetweenX && isBetweenY){
				this.y = obj.y1 - this.h;
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
		for(ladder of ladders){
			if(this.isOnTop(ladder)){
				this.x = ladder.x1 + (BEAMWIDTH - this.w) / 2;
				this.ladderClimbing = ladder;
				return true;
			}
		}
		return false;
	}

	isOnBottomOfLadder(){
		for(ladder of ladders){
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
			for(beam of beams){
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
				for(hammer of hammers){
					if(isThereCollision(this, hammer)){
						this.hasHammer = true;
						this.hammerHeld = hammer;
						hammer.isHeld = true;
						hammer.timeout = millis() + 10000;
					}
	
				}
			}
		}

		// barrels
		
		for(barrel of barrels){
			if(isThereCollision(this, barrel)){
				lostLife();
				return;
			}
		}

		// TODO spark
		for(spark of sparks){
			if(isThereCollision(this, spark)){
				lostLife();
				return;
			}
		}

	}

	updatePosition(){
		if(this.hasHammer && millis() > this.hammerHeld.timeout){
			//TODO DELETE HAMMER
			for(let [i, hammer] of hammers.entries()){
				if(this.hammerHeld == hammer){
					hammers.splice(i, 1)
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
				if(this.ladderClimbing.isComplete){
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
		console.log(this.maxX);

		push();
		// strokeWeight(3);
		stroke("blue");
		fill("red");
		square(this.x, this.y, this.h);
		pop();
	}
}

//TODO first barrel rolls sraight through
// TODO Except if blue: if barrel below Mario go out of bounds (don't reverse). Then kill.
class Barrel extends BasePhysicsActor{
	constructor(crazy=false){
		super(100, 100, BEAMWIDTH * 2, 30);
		this.crazy = crazy;
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
			for(beam of beams){
				if(this.isOnTop(beam)){
					this.isGrounded = true;
					if(this.isFalling){
						this.isFalling = false;
						this.direction *= -1;
					}
					//check if we can go down a ladder
					for(ladder of ladders){
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

		rect(this.x, this.y, this.w, this.h, 4);
	}
}

//TODO cannot fall from ledge
//TODO only spawn from blue barrels?
// TODO max number of fireballs at once?
class Spark extends BasePhysicsActor{
	constructor(){
		super(100, HEIGHT - BEAMWIDTH * 3, BEAMWIDTH * 2, BEAMWIDTH * 2);
		this.onLadder = false;
		this.ladderClimbing = null;
	}

	checkCollision(){
		if(!this.onLadder){
			// collision with beam
			// for(beam of beams){
			// 	if(this.isOnTop(beam)){
			// 		break;
			// 	}
			// }

			for(ladder of ladders){
				//TODO make more rare
				if(this.isOnBottom(ladder)){
					if(mario.y < this.y){
						this.x = ladder.x1 + (BEAMWIDTH - this.w) / 2;
						this.onLadder = true;
						this.ladderClimbing = ladder;
						this.velY = -MARIOSPEED;
						this.velX = 0;
					}
				}
				else if(this.isOnTop(ladder)){
					if(mario.y > this.y){
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

		push();
		// strokeWeight(3);
		stroke("orange");
		fill("orange");
		square(this.x, this.y, this.h);
		pop();
	}
}

//TODO how much time?
class Hammer{
	constructor(x, y){
		this.x = x;
		this.y = y;
		this.h = 30;
		this.w = 24;
		this.isHeld = false;
		this.isDown = false;
		this.timeout = 0;
	}

	checkCollision(){
		for(let [i, barrel] of barrels.entries()){
			if(isThereCollision(this, barrel)){
				barrels.splice(i, 1)
				return;
			}
		}

		for(let [i, spark] of sparks.entries()){
			if(isThereCollision(this, spark)){
				sparks.splice(i, 1)
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
			this.x = mario.x + 12;
			this.y = mario.y - this.h;
		}
		// hammer down
		else{
			this.isDown = true;
			this.y = mario.y;

			this.x = mario.x;
			if(mario.facingLeft){
				this.x -= this.w;
			}
			else{
				this.x += mario.w;
			}
		}
	}

	draw(){
		if(this.isHeld){
			this.updatePosition();
			this.checkCollision();
		}
		push();
		strokeWeight(3);
		fill('red');
		//TODO rotate based on mario.facingLeft and this.isDown
		rect(this.x, this.y, this.w, this.h);
		pop();
	}
}

class Beam{
	constructor(x1, y1, x2, y2 = 0, len = 0, rot = 0){
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;

		if(y2 == 0){
			this.y2 = y1 + BEAMWIDTH;
		}else{
			this.y2 = y2;
		}

		if(len == 0){
			this.len = x2-x1;
		}
		else{
			this.len = len;
		}
		this.rotation = rot;
	}

	draw(){
		push();
		strokeWeight(3);
		stroke("red");
		fill('black');
		rotate(this.rotation);
		rect(this.x1, this.y1, this.len, BEAMWIDTH);
		pop();
	}
}

class Ladder{
	constructor(x1, y1, y2, isComplete=true){
		this.x1 = x1;
		this.x2 = x1 + BEAMWIDTH;
		this.y1 = y1;
		this.y2 = y2;
		this.isComplete = isComplete;
	}

	draw(){
		push();
		strokeWeight(3);
		stroke("cyan");
		fill('black');
		rect(this.x1, this.y1, BEAMWIDTH, this.y2 - this.y1);
		pop();
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
}


function setup() {
	createCanvas(WIDTH, HEIGHT);
	strokeWeight(2);
	stroke("white");
	fill("white");
	
	lives = 2;
	score = 0;
	curLevel = 1;
	time = 0;
	nextSecond = 1000;
	bonus = 4500;
	startPause = false;
	newStartTime = 0;

	beams = [new Beam(0, HEIGHT - BEAMWIDTH, WIDTH), new Beam(0, HEIGHT - 200, WIDTH)];
	ladders = [new Ladder(100, HEIGHT-200, HEIGHT - BEAMWIDTH), new Ladder(WIDTH - 100, HEIGHT-200, HEIGHT - BEAMWIDTH)];
	mario = new Mario(200, HEIGHT - 3 * BEAMWIDTH);
	barrels = [];
	barrels = [new Barrel()];
	sparks = [];
	// sparks = [new Spark()];
	hammers = [new Hammer(170, 660)];
}


/* Draw function */

function draw() {
	if(startPause){
		if(millis() - newStartTime > 4000){
			//TODO reset level
			mario = new Mario(50, HEIGHT - 3 * BEAMWIDTH);
			barrels = [];
			bonus = 4500;
			time = 0;
			nextSecond = 1000;
			startPause = false;
		}
		else{
			return;
		}
	}

	clear();
	background(0);

	for(ladder of ladders){
		ladder.draw();
	}

	for(beam of beams){
		beam.draw();
	}

	for(barrel of barrels){
		barrel.draw();
	}

	for(spark of sparks){
		spark.draw();
	}

	for(hammer of hammers){
		hammer.draw();
	}

	mario.draw();

	// handle mario being hit
	if(bLifeLost){
		bLifeLost = false;

		if(lives < 0){
			bGameOver = true;
			lives = 0;
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
			// restart level
			startPause = true;
			newStartTime = millis();
		}
	}
	

	// PRINT SCORE INFO
	time+= deltaTime;
	if(bonus > 0 && time > nextSecond){
		bonus -= 100;
		nextSecond += 1000;
	}
	highScore = Math.max(highScore, score);
	textSize(35);
	textAlign(CENTER, TOP);
	text('HIGH SCORE', WIDTH / 2, 5);
	text(highScore.toString(), WIDTH / 2, 40);
	text(score.toString(), 120, 5);
	text(lives.toString(), 120, 40);
	text('LEVEL ' + curLevel.toString(), WIDTH - 120, 5);
	text('BONUS:', WIDTH - 120, 40);
	text(bonus.toString(), WIDTH - 120, 75);
}