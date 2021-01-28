/*
	File: pong.js

	A single-player pong game

*/


// TODO:
// - angular bounce

const HEIGHT = 600;
const WIDTH = 900;
const SPEEDINCREASE = 1.01;

let humanScore = 0;
let AIScore = 0;


let bStart = true;
let bGameOver = false;
let bWin = false;

let padLen;
let padHalfLen;

let toRight = true;


class Ball{
	constructor() {
		this.x = 0;
		this.y = 0;
		this.speedX = 0;
		this.speedY = 0;
	}

	updatePos(AIY, humanY){
		let nextX = this.x + this.speedX;
		let nextY = this.y + this.speedY;

		// AI pad collision
		if(nextX <= 30 && abs(AIY - nextY) <= padHalfLen && this.x > 30){
			nextX = 60 - nextX;
			this.speedX = - (this.speedX * SPEEDINCREASE);
		}
		// human pad collision
		else if(nextX >= WIDTH - 30 && abs(humanY - nextY) <= padHalfLen && this.x < WIDTH - 30){
			nextX = 2*WIDTH- 60 - nextX;
			this.speedX = - (this.speedX * SPEEDINCREASE);
		}
		// top wall collision
		if(nextY <= 10){
			nextY = 20 - nextY;
			this.speedY = - this.speedY;
		}
		// bottom wall collision
		else if(nextY >= HEIGHT - 10){
			nextY = 2* HEIGHT -20 - nextY;
			this.speedY = - this.speedY;
		}

		this.x = nextX;
		this.y = nextY;
	}

	updateSpeed(x, y){
		this.speedX = x;
		this.speedY = y;
	}
}


class Pad{
	constructor(pos, minY, maxY) {
		this.posY = pos;
		this.minY = minY;
		this.maxY = maxY;
	}

	updatePos(pos){
		if(pos > this.maxY){
			this.posY = this.maxY;
		}
		else if(pos < this.minY){
			this.posY = this.minY;
		}
		else{
			this.posY = pos
		}
	}
}


function setup() {
	createCanvas(WIDTH, HEIGHT);
	textSize(50);
	fill(255);

	padLen = HEIGHT / 5;
	padHalfLen = HEIGHT / 10;

	ball = new Ball();
	humanPad = new Pad(HEIGHT/2, padHalfLen, HEIGHT- padHalfLen);
	AIPad = new Pad(HEIGHT/2, padHalfLen, HEIGHT- padHalfLen);
}


function draw() {
	// restart ball from middle
	if(bStart){
		ball.x = WIDTH / 2;
		ball.y = HEIGHT / 2;
		
		ball.speedX = toRight? 7 : -7;
		ball.speedY = random(-10, 10);
		
		bStart = false;
		toRight = !toRight;
	}

	clear();
	background(0);

	// pads
	AIPad.updatePos(getAIPos(AIPad.posY, ball));
	humanPad.updatePos(mouseY);

	rect(10, AIPad.posY - padHalfLen, 10, padLen);
	rect(WIDTH - 20, humanPad.posY - padHalfLen, 10, padLen);
	
	// ball
	ball.updatePos(AIPad.posY, humanPad.posY);
	circle(ball.x, ball.y, 20);
	

	//check for out of bounds / game over
	if(ball.x <= -10){
		bStart = true;
		humanScore++;

		if(humanScore == 6){
			bGameOver = true;
			bWin = true;
		}
	}
	else if(ball.x >= WIDTH + 10){
		bStart = true;
		AIScore++;

		if(AIScore == 6){
			bGameOver = true;
		}
	}
	

	//score
	text(AIScore.toString(), WIDTH/2 - 70, 50);
	text(humanScore.toString(),WIDTH/2 + 50, 50);

	// handle game over
	if(bGameOver){
		noLoop();
		if(bWin){
			resultStr = "Congrats! You won!";
		}
		else{
			resultStr = "You lost! Try again."
		}

		createP(resultStr).style('color', '#000').style('font-size', '32pt');
	}
}