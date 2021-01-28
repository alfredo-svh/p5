// TODO make it better
// ideas:
// - lerp?
// invisible ball


function getAIPos(curY, ball){
	// t = Dx / Vx
	let t = abs(ball.x - 30) / abs(ball.speedX);
	
	// Dy = Vy * t
	let dY = ball.y + (ball.speedY * t);


	// perfect ai
	// if(dY > HEIGHT){
	// 	dY = 2*HEIGHT - dY;
	// }
	// else if(dY < 0){
	// 	dY =  - dY;
	// }

	// imperfect ai
	if( dY > curY + padHalfLen){
		return curY + 4;
	}
	else if(dY < curY - padHalfLen){
		return curY - 4;
	}
	
	return curY;
}