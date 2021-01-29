/* 
	file: ticTacToe.js

	Human vs (unbeatable) minimax AI tic tac toe game
*/

const human = 0;
const ai = 1;

let board = [['', '', ''], ['', '', ''], ['', '', '']];
let players = ['X', 'O'];

let curPlayer = 0;
let moves = 0;

let bGameOver = false;
let winner = null;

let p;
let btn;


function isGameOver(){
	// horizontal
	for(let i =0;i<3;i++){
		if(board[i][0] != '' && board[i][0] == board[i][1] && board[i][1] == board[i][2]){
			return true;
		}
	}

	// vertical
	for(let i =0;i<3;i++){
		if(board[0][i] != '' && board[0][i] == board[1][i] && board[1][i] == board[2][i]){
			return true;
		}
	}

	// diagonal
	if(board[0][0] != '' && board[0][0] == board[1][1] && board[1][1] == board[2][2]){
		return true;
	}
	if(board[0][2] != '' && board[0][2] == board[1][1] && board[1][1] ==board[2][0]){
		return true;
	}

	return false;
}


function mousePressed(){
	if(curPlayer == ai || bGameOver){
		return;
	}
	if(mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height){
		return;
	}

	let i = floor(mouseY / height * 3);
	let j = floor(mouseX / width * 3);

	if(board[i][j] == ''){
		board[i][j] = players[human];
		moves++;

		if(isGameOver()){
			bGameOver = true;
			winner = human;
		}else if(moves == 9){
			// tie
			bGameOver = true;
		}else{
			curPlayer = ai;
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
	textSize(height/3);

	let resultStr = '';
	y = height / 3;
	x = width / 3;

	// draw board
	strokeWeight(4);
	line(0, y, width,y);
	line(0, 2* y, width , 2*y);
	line(x, 0, x, height);
	line(x*2, 0, x*2, height);
}

function draw() {
	if(!bGameOver && curPlayer == ai){
		AIMove();
		moves++;
		if(isGameOver()){
			bGameOver = true;
			winner = curPlayer;
		}else if(moves == 9){
			bGameOver = true;
		}else{
			curPlayer = human;
		}
	}

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
			if(winner == human){
				resultStr = "Congratulations! You won!";
			}
			else{
				resultStr = "You lost! Try again.";
			}
		}

		p = createP(resultStr).style('color', '#000').style('font-size', '32pt');
		btn = createButton("Play again?");
		btn.mousePressed(restart);
	}
}