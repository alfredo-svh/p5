/*
	File: breakout.js

	A breakout clone

*/


// TODO
// - improve brick collisions (if no brick around to it)
// - comment code



const HEIGHT = 550;
const WIDTH = 1000;
const BRICKCOLS = 14;
const SPEEDINCREASE = 1.3;
const INITIALSPEED = 5;


let lives = 3;
let score = 0;

let bricksLeft = 8* BRICKCOLS;
let hits = 0;
let bRedHit = false;
let bOrangeHit = false;

let bricks = [];

let bStart = true;
let bGameOver = false;
let bWin = false;
let bLevel2 = false;

let pResult;
let btn;


// ball class which contains its location and speed
// it also contains the function to update its position and speed based on collisions
class Ball{
	constructor() {
		this.x = 0;
		this.y = 0;
		this.speedX = 0;
		this.speedY = 0;
	}

	updatePos(pd){
		let nextX = this.x + this.speedX;
		let nextY = this.y + this.speedY;
		// let difX = nextX - this.x;
		// let difY = nextY - this.y;
		
		let extraX = this.speedX > 0 ? 10 : -10;
		let extraY = this.speedY > 0 ? 10 : -10;
		let j = floor((nextX + extraX) / x);
		let i = floor((nextY-padding + extraY) / y);
		
		let distPaddle = pd.posX - nextX;
		
		// brick collision
		if (i >= 0 && j>=0 && i< 8 && j< BRICKCOLS && !bricks[i][j].broken){
			let brick = bricks[i][j];
			brick.broken = true;
			bricksLeft--;
			hits++;
			
			if(hits == 4 || hits == 12){
				this.speedX *= SPEEDINCREASE;
				this.speedY *= SPEEDINCREASE;
			}

			switch(i){
				case 7:
				case 6:
					score++;
					break;
				case 5:
				case 4:
					score += 3;
					break;
				case 3:
				case 2:
					score += 5;
					if(!bOrangeHit){
						bOrangeHit = true;
						this.speedX *= SPEEDINCREASE;
						this.speedY *= SPEEDINCREASE;
					}
					break;
				default:
					score += 7;
					if(!bRedHit){
						bRedHit = true;
						this.speedX *= SPEEDINCREASE;
						this.speedY *= SPEEDINCREASE;
					}
			};

			// brick rebound
			if(this.x + 10 < brick.x){
				nextX = nextX = 2* brick.x -20 - nextX;
				this.speedX = -this.speedX;
			}
			else if(this.x - 10 > brick.x + x){
				nextX = nextX = 2* brick.x + 20 + 2*x - nextX;
				this.speedX = -this.speedX;
			}
			else if(this.y + 10< brick.y){
				nextY = 2*brick.y - 20 - nextY;
				this.speedY = -this.speedY;
			}
			else if(this.y - 10 > brick.y + y){
				nextY = nextY = 2* brick.y + 20 + 2*y - nextY;
				this.speedY = -this.speedY;
			}

		}

		// pad collision
		else if(nextY >= HEIGHT - 30 && abs(distPaddle ) <= pd.halfLen + 20 && this.y < HEIGHT - 30){
			// flip the direction of its movement
			nextY = 2*HEIGHT- 60 - nextY;
			this.speedY = -this.speedY;

			// calculate new x direction based on the part of the paddle hit
			this.speedX = tan(distPaddle*45 / (pd.halfLen + 20)) * this.speedY;
			nextX = this.x + this.speedX;

			if(bricksLeft == 0){
				if(bLevel2 == false){
					bLevel2 = true;
					restart();
				}
				else{
					bWin = true;
					bGameOver = true;
				}
			}
		}
		// top wall collision
		else if(nextY <= 10){
			nextY = 20 - nextY;
			this.speedY = - this.speedY;

			pd.shrink();
		}
		// left wall collision
		if(nextX <= 10){
			nextX = 20 - nextX;
			this.speedX = - this.speedX;
		}
		// right wall collision
		else if(nextX >= WIDTH - 10){
			nextX = 2*WIDTH - 20 - nextX;
			this.speedX = - this.speedX;
		}
		this.x = nextX;
		this.y = nextY;
	}
}


class Paddle{
	constructor(len) {
		this.len = len;
		this.halfLen = len / 2;
		this.posX = WIDTH / 2;
		this.minX = this.halfLen;
		this.maxX = WIDTH - this.halfLen;
		this.shrunk = false;
	}

	updatePos(pos){
		if(pos > this.maxX){
			this.posX = this.maxX;
		}
		else if(pos < this.minX){
			this.posX = this.minX;
		}
		else{
			this.posX = pos;
		}
	}

	shrink(){
		if(!this.shrunk){
			this.len /= 2;
			this.halfLen /= 2;
			this.minX = this.halfLen;
			this.maxX = WIDTH - this.halfLen;
			this.shrunk = true;
		}
	}

	deShrink(){
		if(this.shrunk){
			this.len *= 2;
			this.halfLen *= 2;
			this.minX = this.halfLen;
			this.maxX = WIDTH - this.halfLen;
			this.shrunk  = false;
		}
	}
}


class Brick{
	constructor(x1, y1, color){
		this.x = x1;
		this.y = y1;
		this.color = color;
		this.broken = false;
	}
}


function restart(){
	if(bGameOver){
		lives = 3;
		score = 0;
		bStart = true;
		btn.remove();
		bGameOver = false;
		bWin = false;
		loop();
	}

	bricksLeft = 8 * BRICKCOLS;
	for(let i = 0; i < 8; i++){
		for(let j = 0; j < BRICKCOLS; j++){
			bricks[i][j].broken = false;
		}
	}
}


function setup() {
	createCanvas(WIDTH, HEIGHT);
	// textSize(50);
	// noStroke();
	angleMode(DEGREES);

	pLives = createP(String(lives)).style('color', '#000').style('font-size', '32pt');
	pScore = createP(String(score)).style('color', '#000').style('font-size', '32pt');

	ball = new Ball();
	paddle = new Paddle(WIDTH/ 10);

	x = WIDTH / BRICKCOLS;
	y = HEIGHT / 40;

	padding = HEIGHT / 7;

	for(let i = 0; i < 8; i++){
		bricks.push([]);
		for(let j = 0; j < BRICKCOLS; j++){
			let x1 = j * x;
			let y1 =  padding + (i * y);
			let color;
			switch(i){
				case 0:
				case 1:
					color = "red";
					break;
				case 2:
				case 3:
					color = "orange";
					break;
				case 4:
				case 5:
					color = "green";
					break;
				default:
					color = "yellow";
			}
			bricks[i].push(new Brick(x1, y1, color));
		}
	}
}


function draw() {
	// restart ball from middle
	if(bStart){
		ball.x = random([0, WIDTH / 2, WIDTH]);
		ball.y = HEIGHT / 2;
		
		ball.speedX = random([-INITIALSPEED, INITIALSPEED]);
		ball.speedY = INITIALSPEED;
		
		bStart = false;
		hits = 0;
		bRedHit = false;
		bOrangeHit = false;
	}

	clear();
	background(0);

	// bricks
	for(let i = 0; i < 8; i++){
		for(let j = 0; j < BRICKCOLS; j++){
			let b = bricks[i][j];
			if(!b.broken){
				fill(b.color);
				rect(b.x, b.y, x, y);
			}
		}
	}

	fill(255);

	// paddle
	paddle.updatePos(mouseX);
	rect(paddle.posX - paddle.halfLen, HEIGHT - 20, paddle.len, 10);
	
	// drawing the ball
	ball.updatePos(paddle);
	circle(ball.x, ball.y, 20);
	
	//check for out of bounds / game over
	if(ball.y >= HEIGHT + 10){
		bStart = true;
		lives--;
		paddle.deShrink();

		if(lives == 0){
			bGameOver = true;
		}
	}

	// drawing the score
	pLives.html("Lives left: " + String(lives));
	pScore.html("Score: " + String(score));
	// text(humanScore.toString(),WIDTH/2 + 50, 50);

	// handle game over
	if(bGameOver){
		noLoop();
		if(bWin){
			resultStr = "Congrats! You won!";
		}
		else{
			resultStr = "You lost! Try again."
		}

		pResult = createP(resultStr).style('color', '#000').style('font-size', '32pt');
		btn = createButton('Play again?');
		btn.mousePressed(restart);
	}
}