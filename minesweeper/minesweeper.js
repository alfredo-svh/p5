/*
	File: minesweeper.js

	A minesweeper game

*/

const numCellsWidth = 16;
const numCellsHeight = 16;

let board = [];

let mine = '💥';
let flag = '⛳';
let question = '❓';

let curPlayer = 0;
let moves = 0;

let bGameOver = false;
let winner = null;

function initializeBoard(){
	for(let i = 0; i < numCellsHeight;i++){
		board.push([]);
		for(let j = 0; j < numCellsWidth;j++){
			board[i].push('');
		}
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

	let i = floor(mouseY / height * numCellsHeight);
	let j = floor(mouseX / width * numCellsWidth);

	if(board[i][j] == ''){
		board[i][j] = mine;
		// moves++;
		// if(!isGameOver()){
		// 	changeCurPlayer();
		// }
	}
}


function setup() {
	createCanvas(730, 730);
	background(220);

	let resultStr = '';

	initializeBoard();
	
	// draw board
	y = height / numCellsHeight;
	x = width / numCellsWidth;
	strokeWeight(4);
	for(let i =1; i < numCellsHeight;i++){
		line(0, y*i, width,y*i);
	}
	for(let i =1; i<numCellsWidth;i++){
		line(x*i, 0, x*i, height);
	}
}

function draw() {
	// put drawing code here
	textSize(height/numCellsHeight - 15);
	textAlign(LEFT, TOP);

	// drawing moves
	for(let i = 0; i < numCellsHeight;i++){
		for(let j = 0; j < numCellsWidth;j++){
			// text(board[i][j], j * x, i * y, (j + 1) * x, (i+1) * y);
			text(board[i][j], j * x+2, i * y+10);
		}
	}

	if(bGameOver){
		noLoop();
		if(winner == null){
			resultStr = "It's a tie!";
		}
		else{
			resultStr = winner + " is the winner!"
		}

		createP(resultStr).style('color', '#000').style('font-size', '32pt');
	}
}