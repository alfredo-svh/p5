/*
	File: AIPos.js

	Contains the function the AI uses to update its Y position for the game of Pong
	
*/

function getAIPos(curY, ball){
	// modify this value to change difficulty
	let speed = 4;


	// t = Dx / Vx
	let t = abs(ball.x - 30) / abs(ball.speedX);
	
	// Dy = Vy * t
	let dY = ball.y + (ball.speedY * t);

	if( dY > curY + padHalfLen){
		return curY + speed;
	}
	else if(dY < curY - padHalfLen){
		return curY - speed;
	}
	
	return curY;
}