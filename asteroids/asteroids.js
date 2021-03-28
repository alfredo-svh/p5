/*
File: asteroids.js

An Asteroids clone

*/


// TODO BUGS / ENHANCEMENTS:
// - NEW GAME
// - clear to spwan radius tweak
// - SAUCER RESPAWN TWEAK INTERVAL (max and min intervals and use score?)
// - SMALLEST ASTEROID COLLISION?
// - create updatePos() function

const WIDTH = 900;
const HEIGHT = 700;

lives = 5;
score = 0;
bGameOver = false;


/* Helper functions */
	
function circlesIntersect(c1X, c1Y, c1Radius, c2X, c2Y, c2Radius){
	var distanceX = c2X - c1X;
	var distanceY = c2Y - c1Y;     
	var magnitudeSquared = distanceX * distanceX + distanceY * distanceY;

	return magnitudeSquared < (c1Radius + c2Radius) * (c1Radius + c2Radius);
}

function initializeAsteroids(num, size = 40, x = 0, y = 0){
	for(let i =0; i < num; i++){
		asteroids.push(new Asteroid(x, y, size));
		currentAsteroids++;
	}
}

function clearToSpawn(){
	for(let i = 0; i < asteroids.length; i++){
		if(asteroids[i] && circlesIntersect(asteroids[i].x, asteroids[i].y, asteroids[i].radius, WIDTH / 2, HEIGHT / 2, 50)){
			return false;
		}
	}

	if(saucer && circlesIntersect(saucer.x, saucer.y, saucer.w, WIDTH / 2, HEIGHT / 2, 50)){
		return false;
	}

	return true;
}


/* Classes */

class Saucer{
	constructor(isBig){
		this.x = 0;
		this.y = random(0, HEIGHT);
		this.w = (isBig)? 40 : 20;
		this.h = this.w /2;
		this.y2 = this.y - this.h / 2;
		let maxSpeed = (isBig)? 2 : 6;
		this.speedX = random(-maxSpeed, maxSpeed);
		this.speedY = random(-maxSpeed, maxSpeed);
		this.isBig = isBig;
		this.shootingInterval = (isBig)? 2000 : 1000;
		this.lastShot = millis();

		saucerSound.loop();
		saucerShots = [];
	}

	destroy(){
		saucerSound.stop();
		if(this.isBig){
			score += 200;
		}
		else{
			score += 1000;
		}
		saucer = null;
		lastSaucerTime = millis();
	}

	fire(){
		if(ship){
			this.lastShot = millis();
			if(this.isBig){
				saucerShots.push(new Shot(this.x, this.y, random(0, 359)));
			}
			else{
				let angle = atan2(ship.y - this.y, ship.x - this.x);
				saucerShots.push(new Shot(this.x, this.y, angle - 90));
			}
		}
	}
	
	draw(){
		if(!this.isBig && random(0, 400) < 2){
			this.speedX = random(-6, 6);
			this.speedY = random(-6, 6);
		}
		this.x += this.speedX;
		this.y += this.speedY;
		this.y2 += this.speedY;

		if(this.x > WIDTH){
			this.x = this.x - WIDTH;
		}
		else if(this.x < 0){
			this.x = WIDTH - abs(this.x);
		}
		if(this.y > HEIGHT){
			this.y = this.y - HEIGHT;
			this.y2 = this.y2 - HEIGHT;
		}
		else if(this.y < 0){
			this.y = HEIGHT - abs(this.y);
			this.y2 = HEIGHT - abs(this.y2);
		}

		// collision with shots
		for(let i = 0; i < shots.length; i++){
			if(shots[i] != null && circlesIntersect(this.x, this.y, this.w, shots[i].x, shots[i].y, 2)){
				bang.play();
				shots[i].isDestroyed = true;
				this.destroy();
				return;
			}
		}
		// collision with ship
		if(ship && circlesIntersect(this.x, this.y, this.w, ship.x, ship.y, ship.r)){
			lives--;
			ship = null;
			bang.play();
			lastDead = millis();
		}
		//collision with asteroids
		for(let i = 0; i < asteroids.length; i++){
			if(asteroids[i] != null && !asteroids[i].isDestroyed && circlesIntersect(this.x, this.y, this.w, asteroids[i].x, asteroids[i].y, asteroids[i].radius)){
				bang.play();
				this.destroy();
				asteroids[i].isDestroyed = true;
				asteroids[i].destroy();
				return;
			}
		}

		if(millis() - this.lastShot > this.shootingInterval){
			this.fire();
		}

		ellipse(this.x, this.y, this.w, this.h);
		circle(this.x, this.y2, this.h);
	}
}


class Asteroid{
	constructor(x, y, s){
		this.x = x;
		this.y = y;
		this.radius = s;
		let maxspeed = 50/s;
		this.speedX = random(-maxspeed, maxspeed);
		this.speedY = random(-maxspeed, maxspeed);
		this.isDestroyed = false;
	}

	destroy(){
		this.isDestroyed = true;
		currentAsteroids--;
		if(this.radius > 10){
			initializeAsteroids(2, this.radius /2, this.x, this.y);

			if(this.radius == 40){
				score += 20;
			}
			else{
				score += 50;
			}
		}
		else{
			score += 100;
		}
	}

	draw(){
		this.x += this.speedX;
		this.y += this.speedY;

		if(this.x > WIDTH){
			this.x = this.x - WIDTH;
		}
		else if(this.x < 0){
			this.x = WIDTH - abs(this.x);
		}
		if(this.y > HEIGHT){
			this.y = this.y - HEIGHT;
		}
		else if(this.y < 0){
			this.y = HEIGHT - abs(this.y);
		}

		// collision with shots
		for(let i = 0; i < shots.length; i++){
			if(shots[i] != null && !shots[i].isDestroyed && circlesIntersect(this.x, this.y, this.radius, shots[i].x, shots[i].y, 2)){
				bang.play();
				shots[i].isDestroyed = true;
				this.destroy();
				return;
			}
		}
		for(let i = 0; i < saucerShots.length; i++){
			if(saucerShots[i] != null && !saucerShots[i].isDestroyed && circlesIntersect(this.x, this.y, this.radius, saucerShots[i].x, saucerShots[i].y, 2)){
				bang.play();
				saucerShots[i].isDestroyed = true;
				this.destroy();
				return;
			}
		}
		// collision with ship
		if(ship && circlesIntersect(this.x, this.y, this.radius, ship.x, ship.y, ship.r)){
			lives--;
			ship = null;
			bang.play();
			lastDead = millis();
		}

		circle(this.x, this.y, this.radius << 1);
	}
}


class Shot{
	constructor(x, y, rotation){
		this.x = x;
		this.y = y;
		this.speedX = 30 * cos(rotation + 90);
		this.speedY = 30 * sin(rotation + 90);
		this.created = millis();
		this.isDestroyed = false;
		fireSound.play();
	}

	draw(){
		this.x += this.speedX;
		this.y += this.speedY;

		if(this.x > WIDTH){
			this.x = this.x - WIDTH;
		}
		else if(this.x < 0){
			this.x = WIDTH - abs(this.x);
		}
		if(this.y > HEIGHT){
			this.y = this.y - HEIGHT;
		}
		else if(this.y < 0){
			this.y = HEIGHT - abs(this.y);
		}

		strokeWeight(4);
		point(this.x, this.y);
		strokeWeight(2);
	}
}

class Ship{
	constructor(){
		this.x = WIDTH / 2;
		this.y = HEIGHT / 2;
		this. rotation = 0;
		this.speedX = 0;
		this.speedY = 0;
		this.direction = 0;
		this.r = 15;
	}

	rotateRight(){
		this.rotation += 5;
	}

	rotateLeft(){
		this.rotation-=5;
	}

	accelerate(){
		thrustSound.play();
		this.direction = this.rotation;
		let acc;

		if(abs(this.speedX) < 600 && abs(this.speedY) < 600){
			acc = 8;
		}
		else{
			acc = 1;
		}
		this.speedX += cos(this.direction + 90) * acc;
		this.speedY += sin(this.direction + 90) * acc;
	}

	hyperSpace(){
		this.x = random(0, WIDTH);
		this.y = random(0, HEIGHT);
		this.speedX = 0;
		this.speedY = 0;
	}

	fire(){
		if(shots.length < 20){
			shots.push(new Shot(this.x, this.y, this.rotation));
		}
		else{
			for(let i=0;i<shots.length;i++){
				if(shots[i] == null){
					shots[i] = new Shot(this.x, this.y, this.rotation);
					break;
				}
			}
		}
	}

	draw(){
		// update speed
		this.speedX *= 0.99;
		this.speedY *= 0.99;

		// update position
		this.x += this.speedX/100;
		this.y += this.speedY/100;
		// wrap-around
		this.x = this.x % WIDTH;
		this.y = this.y % HEIGHT;
		if(this.x < 0){
			this.x = WIDTH;
		}
		if(this.y < 0){
			this.y = HEIGHT;
		}

		// respawn cooldown

		for(let i = 0; i < saucerShots.length;i++){
			if(saucerShots[i] != null && !saucerShots[i].isDestroyed && circlesIntersect(this.x, this.y, this.r, saucerShots[i].x, saucerShots[i].y, 2)){
				saucerShots[i].isDestroyed = true;
				lives--;
				ship = null;
				bang.play();
				lastDead = millis();
				return;
			}
		}

		// update rotation
		translate(this.x, this.y);
		rotate(this.rotation);
		translate(-this.x, -this.y);
		triangle(this.x, this.y + 15, this.x-7, this.y-7, this.x+7, this.y-7);
	}
}


/* Input functions */

function handleInput(){
	if(keyIsDown(RIGHT_ARROW)){
		ship.rotateRight();
	}
	
	if(keyIsDown(LEFT_ARROW)){
		ship.rotateLeft();
	}

	if(keyIsDown(UP_ARROW)){
		ship.accelerate();
	}
}

function keyPressed(){
	if(!ship){
		return;
	}

	switch(keyCode){
		case ENTER:
			ship.hyperSpace();
			break;
			
		case 32:
			ship.fire();
	}
}


/* Initializing functions */

function preload(){
	fireSound = loadSound('sound/fire.wav');
	thrustSound = loadSound('sound/thrust.wav');
	beat1 = loadSound('sound/beat1.wav');
	beat2 = loadSound('sound/beat2.wav');
	bang = loadSound('sound/bangLarge.wav');
	saucerSound = loadSound('sound/saucerBig.wav');
	newLife = loadSound('sound/extraShip.wav');
}


function setup() {
	createCanvas(WIDTH, HEIGHT);
	noFill();
	strokeWeight(2);
	stroke(255);
	angleMode(DEGREES);

	newAsteroids = 4;
	currentAsteroids = 0;
	ship = new Ship();
	asteroids = [];
	saucerShots = [];
	saucer = null;
	shots = [];
	time = 0; //frames
	beatInterval =120; //frames
	saucerInterval = 10000; //millisecons
	lastSaucerTime = 0; //milliseconds
	lastDead =  0;
	nextLife = 10000;

	initializeAsteroids(newAsteroids);
	scoreP = createP("Score: " + score.toString()).style('color', '#000').style('font-size', '32pt');
	livesP = createP("Lives: " + lives.toString()).style('color', '#000').style('font-size', '32pt');
}


/* Draw function */

function draw() {
	clear();
	background(0);

	if(!ship && millis() - lastDead > 3000 && clearToSpawn()){
		ship = new Ship();
	}

	if(ship){
		handleInput();
	}

	if(currentAsteroids == 0 && !saucer){
		if(score < 40000){
			newAsteroids++;
		}
		asteroids = [];
		initializeAsteroids(newAsteroids);
	}
	
	for(let i=0; i < asteroids.length; i++){
		if(asteroids[i]){
			if(asteroids[i].isDestroyed){
				asteroids[i] = null;
			}
			else{
				asteroids[i].draw();
			}
		}
	}
	
	for(let i = 0; i < shots.length; i++){
		if(shots[i]){
			if(millis() - shots[i].created > 300 || shots[i].isDestroyed){
				shots[i] = null;
			}
			else{
				shots[i].draw();
			}
		}
	}
	for(let i = 0; i < saucerShots.length; i++){
		if(saucerShots[i]){
			if(millis() - saucerShots[i].created > 300 || saucerShots[i].isDestroyed){
				saucerShots[i] = null;
			}
			else{
				saucerShots[i].draw();
			}
		}
	}


	if(saucer){
		saucer.draw();
	}

	if(score > nextLife){
		nextLife += 10000;
		lives++;
		newLife.play();
	}
	
	if(ship){
		ship.draw();
	}
	else if(lives == 0){
		bGameOver = true;
		textSize(80);
		textAlign(CENTER, CENTER);
		text("GAME OVER", 0, 0, WIDTH, HEIGHT);
		noLoop();
		if(saucer){
			saucerSound.stop();
		}
	}
	

	if(time == beatInterval){
		beat2.play();
		if(beatInterval > 30){
			beatInterval--;
		}
		time = -1;
	}
	else if(time == Math.ceil(beatInterval / 2)){
		beat1.play();
	}

	if(millis() - lastSaucerTime > saucerInterval && !saucer){
		let newSaucerBig = true;
		let r = random(0, 40000);
		if(score > r){
			newSaucerBig = false;
		}
		saucer = new Saucer(newSaucerBig);
		saucerInterval--;
	}

	time++;
	scoreP.html("Score: " + score.toString());
	livesP.html("Lives: " + lives.toString());
}