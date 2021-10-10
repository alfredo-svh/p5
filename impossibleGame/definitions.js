/*
	File: definitions.js

	Provides the global variables, constants, and class definitions of an Impossible Game clone

*/

const HEIGHT = 720;
const WIDTH = 1280;
const TILELENGTH = 50; // 80 pixels
const FLOOR = 10 * TILELENGTH;
const PLAYERX = 7.5 * TILELENGTH;
const MAXHEIGHTDIFF = 5.5 * TILELENGTH;
const MINHEIGHTDIFF = -0.5 * TILELENGTH;

const CAMERASPEED = 595; //949 pixels per second == 11.9 tiles per second
const GRAVITY = CAMERASPEED / 7.3 * 60;
const JUMPVEL = -CAMERASPEED * 1.6;
const ROTATION = Math.PI * 2.5;


/* Global variables */

cameraHeight = 9 * TILELENGTH;
bGameOver = false;
bWin = false;
record = 0;


/* Classes */
class Player{
	constructor(initialX = PLAYERX, initialY = 0){
		this.len = TILELENGTH;
		this.x = initialX;
		this.y = (9 - initialY) * TILELENGTH;
		this.velY = 0;
		this.rotation = 0;

		this.isJumping = false;
	}

	jump(){
		this.isJumping = true;

		this.velY = JUMPVEL;
	}

	updateSpeed(){
		if(this.isJumping){
			this.velY += GRAVITY * deltaTime / 1000;
			this.rotation += ROTATION * deltaTime / 1000;
		}
		else{
			if(isMouseReleased == false){
				this.jump();
			}
			else{
				this.velY = 0;
			}
		}
	}

	draw(){
		if(this.y >= FLOOR - this.len){
			this.isJumping = false;
			this.y = FLOOR - this.len;
			this.rotation = 0;
		}

		this.updateSpeed();

		this.x += CAMERASPEED * deltaTime / 1000;
		this.y += this.velY * deltaTime / 1000;

		
		stroke(0);
		strokeWeight(2);
		fill('orange');
		push();
		rectMode(CENTER);
		translate(this.x + this.len / 2, this.y + this.len / 2);
		rotate(this.rotation);
		square(0, 0, this.len);
		pop();

		// default is jumping to apply gravity. Changes if player is on ground or on block
		this.isJumping = true;
	}
}

class Block{
	constructor(x, y = 0){
		this.len = TILELENGTH;
		this.x = x * TILELENGTH;
		this.y = (9 - y) * TILELENGTH;
	}

	detectCollision(){
		// get the distance between block and player
		var vX = player.x - this.x;
        var vY = player.y - this.y;
		// if the x and y vector are less than the tile length,
		// then there must be a collision
		// we substract one to the y vector to include the player being on top
		// of the block (this will have the side effect to also include the player being
		// right below the block, which will be handled below)
		if(Math.abs(vX) < TILELENGTH && Math.abs(vY) - 1 < TILELENGTH){
			var oX = TILELENGTH - Math.abs(vX);
            var oY = TILELENGTH - Math.abs(vY);

			// if collision occurs at the top of the block,
			// we land the player
			// if(oX >= oY && vY <= 0){
			if(vY < 0 && player.velY >=0){
				player.isJumping = false;
				player.y -= oY;
				player.rotation = 0;
			}
			// if it happens anywhere else, player dies
			// but we make sure that player is not sliding right under the block
			else{
				if(Math.abs(vY) != TILELENGTH){
					bGameOver = true;
				}
			}
		}

	}

	draw(){
		this.detectCollision();
		strokeWeight(3);
		stroke('white');
		fill(0);
		square(this.x, this.y, this.len);
	}
}

class Spike{
	constructor(x, y = 0){
		this.height = TILELENGTH;
		this.x = x * TILELENGTH + TILELENGTH / 2;
		this.y = (10 - y) * TILELENGTH;
		this.m1 = -2;
		this.m2 = 2;
		this.b1 = this.y - (this.m1 * (this.x - this.height / 2));
		this.b2 = this.y - (this.m2 * (this.x + this.height / 2));
	}

	detectCollision(){
		if(player.y + player.len > this.y - this.height && player.y + player.len <= this.y
		&& player.x + player.len > (player.y + player.len - this.b1) / this.m1 && player.x < (player.y + player.len - this.b2)/this.m2){
			bGameOver = true;
		}
	}

	draw(){
		this.detectCollision();
		strokeWeight(3);
		stroke('white');
		fill(0);
		triangle(this.x - this.height / 2, this.y, this.x + this.height/2, this.y, this.x, this.y - this.height);
	}
}

class Lava{
	constructor(x1, x2){
		this.len = HEIGHT / 9;
		this.x1 = x1 * TILELENGTH;
		this.x2 = x2 * TILELENGTH;
		this.y = FLOOR;
	}

	detectCollision(){
		if(player.y + player.len >= this.y && player.x < this.x2  && player.x + player.len > this.x1){
			bGameOver = true;
		}
	}

	draw(){
		this.detectCollision();
		stroke(1);
		fill(1);
		strokeWeight(5);
		line(this.x1, this.y, this.x2, this.y);
	}
}