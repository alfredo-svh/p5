/*
	File: minesweeper.js

	A minesweeper game

*/


// constants. Can be changed for a more personalized game or for a different difficulty level
const numCellsWidth = 16;
const numCellsHeight = 16;
const totMines = 40;


let board = [];
let bGameOver = false;
let bWin = false;
let tilesToGo = numCellsHeight* numCellsWidth - totMines;
let flaggedMines = 0;

let hidden = '🟦';
let flag = '⛳';
let question = '❓';
let mine = '💥';

let btn;


// Cell class has three members.
// num represents the number of mines directly next to this cell. -1 represents a mine
// state is the current state of the display. It can be hidden, flag, question, or mine
// bFlipped is a bool that holds whether the cell has been clicked by the player
function Cell(){
	this.num = 0;
	this.state = hidden;
	this.bFlipped = false;
}

// initializes board (2-D Cell object array)
// all cells start hidden, not flipped, and holding a 0
function initializeBoard(){
	for(let i = 0; i < numCellsHeight;i++){
		board.push([]);
		for(let j = 0; j < numCellsWidth;j++){
			board[i].push(new Cell());
		}
	}
}

// helper function that updates the numbers of cells around a mine
function setNumbers(yCor, xCor){
	for(let i = yCor-1; i < yCor + 2; i++){
		for(let j = xCor-1; j < xCor + 2; j++){
			if(i > -1 && j > -1 && i < numCellsHeight && j < numCellsWidth && board[i][j].num != -1){
				board[i][j].num++;
			}
		}
	}

}

// randomly populate the board with mines and update the numbers of the cells around those mines
function placeMinesAndNumbers(){
	let yCor = int(random(0, numCellsHeight));
	let xCor = int(random(0, numCellsWidth));

	for(let i = 0; i <totMines; i++){
		// making sure we don't get two mines in the same cell
		while(board[yCor][xCor].num == -1){
			yCor = int(random(0, numCellsHeight));
			xCor = int(random(0, numCellsWidth));
		}

		board[yCor][xCor].num = -1;

		// set numbers around mine
		setNumbers(yCor, xCor);
	}
}

// recursively flips all 0s and first "layer" of non-zeroes around a clicked 0 cell
function clearCluster(i, j){
	let curCell = board[i][j];

	if(curCell.bFlipped == true){
		return;
	}

	// first layer of non-zero numebrs
	if(curCell.num > 0){
		curCell.state = " "+ curCell.num.toString();
		curCell.bFlipped = true;
		tilesToGo--;

		return;
	}

	curCell.state = ' ';
	curCell.bFlipped = true;
	tilesToGo--;

	if(j < numCellsWidth - 1){
		clearCluster(i, j + 1);
	}
	if(i > 0){
		clearCluster(i - 1, j);
	}
	if(j>0){
		clearCluster(i, j - 1);
	}
	if(i < numCellsHeight - 1){
		clearCluster(i + 1, j);
	}
}


function mouseReleased(){
	if(bGameOver || mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height){
		return;
	}

	let i = floor(mouseY / height * numCellsHeight);
	let j = floor(mouseX / width * numCellsWidth);

	let cellClicked = board[i][j];

	
	if(cellClicked.bFlipped){
		return;
	}
	
	if(mouseButton == LEFT){
		if(cellClicked.num == -1){
			cellClicked.state = mine;
			cellClicked.bFlipped = true;

			bGameOver = true;

			return;
		}
		else if(cellClicked.num == 0){
			clearCluster(i, j);

		}else{
			cellClicked.state = " "+ cellClicked.num.toString();
			cellClicked.bFlipped = true;
			tilesToGo--;
		}

		if(tilesToGo <= 0){
			bGameOver = true;
			bWin = true;
		}
		
	}
	else if(mouseButton == RIGHT){
		if(cellClicked.state == hidden){
			cellClicked.state = flag;
			flaggedMines++;
		}
		else if(cellClicked.state == flag){
			cellClicked.state = question;
			flaggedMines--;
		}
		else{
			cellClicked.state = hidden;
		}
	}
}


function restart(){
	board = [];
	bGameOver = false;
	bWin = false;
	tilesToGo = numCellsHeight* numCellsWidth - totMines;
	flaggedMines = 0;

	initializeBoard();
	placeMinesAndNumbers();

	btn.remove();
	loop();
}


function setup() {
	createCanvas(730, 730);
	textSize(height/numCellsHeight - 15);
	textAlign(LEFT, TOP);

	x = width / numCellsWidth;
	y = height / numCellsHeight;

	initializeBoard();
	placeMinesAndNumbers();

	score = createP("Mines left: " + (totMines - flaggedMines).toString()).style('color', '#000').style('font-size', '32pt');
	
}

function draw() {
	// drawing the board
	clear();
	background(220);
	for(let i = 0; i < numCellsHeight;i++){
		for(let j = 0; j < numCellsWidth;j++){
			// text(board[i][j], j * x, i * y, (j + 1) * x, (i+1) * y);
			text(board[i][j].state, j * x+1, i * y+9);
		}
	}
	score.html("Mines left: " + (totMines - flaggedMines).toString());

	if(bGameOver){
		noLoop();
		if(bWin){
			resultStr = "Congrats! You won!";
		}
		else{
			resultStr = "You lost! Try again."
		}

		score.html(resultStr);
		btn = createButton('Play again?');
		btn.mousePressed(restart);
	}
}