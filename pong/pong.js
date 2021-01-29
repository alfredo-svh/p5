/*
	File: pong.js

	A single-player pong game

*/



const HEIGHT = 600;
const WIDTH = 900;
const SPEEDINCREASE = 1.01;


let humanScore = 0;
let AIScore = 0;

let bStart = true;
let bGameOver = false;
let bWin = false;
let toRight = true;
let fromUp = true;

let padLen;
let padHalfLen;

let p;
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

	updatePos(AIY, humanY){
		let nextX = this.x + this.speedX;
		let nextY = this.y + this.speedY;

		let distAI = nextY - AIY;
		let distHuman = humanY - nextY;

		// AI pad collision
		if(nextX <= 30 && abs(distAI) <= padHalfLen + 10 && this.x > 30){
			// flip the direction of its speed
			nextX = 60 - nextX;
			this.speedX = - (this.speedX * SPEEDINCREASE);

			// calculate new y direction based on the part of the paddle hit
			this.speedY =  tan(distAI*45 / padHalfLen) * this.speedX;
			nextY = this.y + this.speedY;
		}
		// human pad collision
		else if(nextX >= WIDTH - 30 && abs(distHuman ) <= padHalfLen + 10 && this.x < WIDTH - 30){
			// flip the direction of its speed
			nextX = 2*WIDTH- 60 - nextX;
			this.speedX = - (this.speedX * SPEEDINCREASE);

			// calculate new y direction based on the part of the paddle hit
			this.speedY = tan(distHuman*45 / padHalfLen) * this.speedX;
			nextY = this.y + this.speedY;
		}
		// top wall collision
		else if(nextY <= 10){
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
}


// pad class. It contains the y position and its min and max possible values of the paddles
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


function restart(){
	humanScore = 0;
	AIScore = 0;

	bStart = true;
	bGameOver = false;
	bWin = false;
	toRight = true;
	fromUp = true;

	p.remove();
	btn.remove();

	loop();
}


function setup() {
	createCanvas(WIDTH, HEIGHT);
	textSize(50);
	fill(255);
	stroke(255);
	angleMode(DEGREES);

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

		ball.y = fromUp? HEIGHT / 4 : HEIGHT* 3 / 4;
		
		ball.speedX = toRight? 7 : -7;
		ball.speedY = random(-10, 10);
		
		bStart = false;
	}

	clear();
	background(0);

	// drawing the net
	for(let i = 0; i < HEIGHT; i+=40){
		line(WIDTH/2, i, WIDTH/2, i+20);
	}

	// updating the position of the paddles
	AIPad.updatePos(getAIPos(AIPad.posY, ball));
	humanPad.updatePos(mouseY);

	// drawing the paddles
	rect(10, AIPad.posY - padHalfLen, 10, padLen);
	rect(WIDTH - 20, humanPad.posY - padHalfLen, 10, padLen);
	
	// drawing the ball
	ball.updatePos(AIPad.posY, humanPad.posY);
	circle(ball.x, ball.y, 20);
	
	//check for out of bounds / game over
	if(ball.x <= -10){
		bStart = true;
		humanScore++;
		toRight = false;
		fromUp = !fromUp;

		if(humanScore == 11){
			bGameOver = true;
			bWin = true;
		}
	}
	else if(ball.x >= WIDTH + 10){
		bStart = true;
		AIScore++;
		toRight = true;
		fromUp = !fromUp;

		if(AIScore == 11){
			bGameOver = true;
		}
	}

	
	// drawing the score
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

		p = createP(resultStr).style('color', '#000').style('font-size', '32pt');
		btn = createButton('Play again?');
		btn.mousePressed(restart);
	}
}