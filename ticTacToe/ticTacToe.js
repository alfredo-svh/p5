/*
	File: ticTacToe.js

	A tic tac toe game between two human players

*/
let board = [['', '', ''], ['', '', ''], ['', '', '']];
let players = ['X', 'O'];

let curPlayer = 0;
let moves = 0;

let bGameOver = false;
let winner = null;

let p;
let btn;


function changeCurPlayer(){
	if(curPlayer == 0){
		curPlayer = 1;
	}else{
		curPlayer = 0;
	}
}


function isGameOver(){
	// horizontal
	for(let i =0;i<3;i++){
		if(board[i][0] != '' && board[i][0] == board[i][1] && board[i][1] == board[i][2]){
			bGameOver = true;
			winner = players[curPlayer];
			return bGameOver;
		}
	}
	// vertical
	for(let i =0;i<3;i++){
		if(board[0][i] != '' && board[0][i] == board[1][i] && board[1][i] == board[2][i]){
			bGameOver = true;
			winner = players[curPlayer];
			return bGameOver;
		}
	}
	// diagonal
	if(board[0][0] != '' && board[0][0] == board[1][1] && board[1][1] == board[2][2]){
		bGameOver = true;
		winner = players[curPlayer];
		return bGameOver;
	}
	if(board[0][2] != '' && board[0][2] == board[1][1] && board[1][1] ==board[2][0]){
		bGameOver = true;
		winner = players[curPlayer];
		return bGameOver;
	}


	if(!bGameOver && moves == 9){
		bGameOver = true;
	}

	return bGameOver;
}


function mousePressed(){
	if(bGameOver || mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height){
		return;
	}

	let i = floor(mouseY / height * 3);
	let j = floor(mouseX / width * 3);

	if(board[i][j] == ''){
		board[i][j] = players[curPlayer];
		moves++;
		if(!isGameOver()){
			changeCurPlayer();
		}
	}
}


function restart(){
	p.remove();
	btn.remove();

	// draw board
	clear();
	background(220);
	line(0, y, width,y);
	line(0, 2* y, width , 2*y);
	line(x, 0, x, height);
	line(x*2, 0, x*2, height);

	board = [['', '', ''], ['', '', ''], ['', '', '']];

	curPlayer = 0;
	moves = 0;

	bGameOver = false;
	winner = null;

	loop();
}


function setup() {
	createCanvas(400, 400);
	background(220);

	let resultStr = '';
	
	// draw board
	y = height / 3;
	x = width / 3;
	strokeWeight(4);
	textSize(height/3);
	line(0, y, width,y);
	line(0, 2* y, width , 2*y);
	line(x, 0, x, height);
	line(x*2, 0, x*2, height);
}


function draw() {

	// drawing moves
	textAlign(LEFT, TOP);
	text(board[0][0], width/20, height/50, width, height);
	textAlign(CENTER, TOP);
	text(board[0][1], width/20, height/50, width, height);
	textAlign(RIGHT, TOP);
	text(board[0][2], width/20, height/50, width, height);
	textAlign(LEFT, CENTER);
	text(board[1][0], width/20, height/50, width, height);
	textAlign(CENTER, CENTER);
	text(board[1][1], width/20, height/50, width, height);
	textAlign(RIGHT, CENTER);
	text(board[1][2], width/20, height/50, width, height);
	textAlign(LEFT, BOTTOM);
	text(board[2][0], width/20, height/50, width, height);
	textAlign(CENTER, BOTTOM);
	text(board[2][1], width/20, height/50, width, height);
	textAlign(RIGHT, BOTTOM);
	text(board[2][2], width/20, height/50, width, height);

	if(bGameOver){
		noLoop();
		if(winner == null){
			resultStr = "It's a tie!";
		}
		else{
			resultStr = winner + " is the winner!"
		}

		p = createP(resultStr).style('color', '#000').style('font-size', '32pt');
		btn = createButton('Play again?');
		btn.mousePressed(restart);
	}
}