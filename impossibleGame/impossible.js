/*
	File: impossible.js

	A "The Impossible Game" clone.
	Global variables, constants, and class definitions in definitions.js
	Level obstacles defined in level.js

*/


//TODO
// - add music?
// - tweak camera movement?
// - tweak gravity & jumpvel?
// - fix stuttering?
// - practice mode?
// - refactor: use global constants?


/* Helper functions */

function setCameraHeight(){
	var heightDiff = cameraHeight - player.y;
	if(heightDiff > MAXHEIGHTDIFF){
		cameraHeight -= 5;
	}
	else if(heightDiff < MINHEIGHTDIFF){
		cameraHeight += 50;
	}
}

function restart(){
	// isMouseReleased = true;
	deathSound.play();
	bGameOver = false;
	attempt++;
	record = max(record, Math.floor(player.x / GOAL * 100));
	player = new Player();
	cameraHeight = 0;
	startBlocks = 0;
	startSpikes = 0;
	startLava = 0;
}

function winScreen(){
	translate(-PLAYERX + player.x, -FLOOR + cameraHeight);
	clear();
	background(0);
	fill(255);
	stroke(255);
	strokeWeight(2);
	text("The End!", WIDTH / 2, HEIGHT / 3);
	text("You made it. Congratulations!", WIDTH / 2, HEIGHT * 2 / 3);
	
	noLoop();
}

/* P5 functions */

function mousePressed(){
	if(bGameOver || bWin){
		return;
	}

	isMouseReleased = false;
	if(player.isJumping || mouseY < 0 || mouseY > HEIGHT){
		return;
	}

	player.jump();
}

function mouseReleased(){
	if(bWin || bGameOver){
		return;
	}

	isMouseReleased = true;
}

function preload(){
	deathSound = loadSound('sound/lose.wav');
	winSound = loadSound('sound/win.wav');
}

function setup() {
	createCanvas(WIDTH, HEIGHT);
	textSize(35);
	textAlign(CENTER, TOP);

	attempt = 1;
	isMouseReleased = true;

	startBlocks = 0;
	startSpikes = 0;
	startLava = 0;

	//DEBUG
	// maxy = 0;
}


function draw() {
	if(deathSound.isPlaying()){
		return;
	}

	clear();
	background('cyan');
	strokeWeight(2);
	fill(255);
	stroke(255);

	// DEBUG:
	// text((Math.floor(player.x / TILELENGTH)).toString(), WIDTH / 2, FLOOR + TILELENGTH);
	// maxy =max(maxy, cameraHeight - player.y);
	// text(maxy.toString(), WIDTH / 2, FLOOR + TILELENGTH);
	
	text("Attempt: " + attempt.toString(), WIDTH / 2, HEIGHT / 10);
	text("Record: " + record.toString() + "%", WIDTH / 2, HEIGHT - 50);
	
	setCameraHeight()
	
	translate(PLAYERX - player.x, FLOOR - cameraHeight);
	
	line(0, FLOOR, GOAL * 2, FLOOR);
	
	for(let i = startBlocks; i < blocks.length; i++){
		//not yet in view, break
		if(blocks[i].x > player.x + WIDTH - PLAYERX - 100){
			break;
		}
		// past view, continue
		if(blocks[i].x < player.x - PLAYERX + 100){
			startBlocks++;
			continue;
		}
		
		blocks[i].draw();
	}
	
	for(let i = startSpikes; i < spikes.length; i++){
		//not yet in view, break
		if(spikes[i].x > player.x + WIDTH - PLAYERX + TILELENGTH / 2 - 100){
			break;
		}
		// past view, continue
		if(spikes[i].x < player.x - PLAYERX - TILELENGTH / 2 + 100){
			startSpikes++;
			continue;
		}
		
		spikes[i].draw();
	}
	
	for(let i = startLava; i < pools.length; i++){
		//not yet in view, break
		if(pools[i].x1 > player.x + WIDTH - PLAYERX - 100){
			break;
		}
		// past view, continue
		if(pools[i].x2 < player.x - PLAYERX + 100){
			startLava++;
			continue;
		}
		
		pools[i].draw();
	}
	
	if(!bGameOver){
		player.draw();
	}

	if(!bGameOver && !bWin && player.x > GOAL){
		bWin = true;
		winSound.play();
	}
	
	// handle game over
	if(bGameOver){
		restart();
	}
	else if(bWin && !winSound.isPlaying()){
		winScreen();
	}
}