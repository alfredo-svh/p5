/*
	File: AIMove.js

	Includes functions for the tic tac toe AI to make its move
*/


// recursive function that returns the best score possible from a particular instance of a board
function minimax(board, bIsAITurn, totMoves){
	// if the game is over, we use the total moves of the solution to calculate our heuristic value
	// (we want to win with the fewest moves possible)
	if(isGameOver()){
		if(bIsAITurn){
			return -10 + totMoves;
		}else{
			return 10 - totMoves;
		}
	}
	// a tie's value is a neutral 0
	if(totMoves == 9){
		return 0;
	}

	let bestScore;

	if(bIsAITurn){
		bestScore = -Infinity;
	}
	else{
		bestScore = Infinity;
	}

	// we recursively check the best score for every possible move we could make and save the best one
	for(let i = 0;i<3;i++){
		for(let j=0; j<3;j++){
			if(board[i][j] == ''){
				board[i][j] = players[int(bIsAITurn)];
				let curScore = minimax(board, !bIsAITurn, totMoves+1);
				board[i][j] = '';

				if(bIsAITurn){
					bestScore = max(curScore, bestScore);
				}
				else{
					bestScore = min(curScore, bestScore);
				}
			}
		}
	}
	return bestScore;

}


// calls the minimax function to place the AI's move on the board
function AIMove(){
	let bestScore = -Infinity;
	let bestMove;
	let totMoves = moves;

	for(let i = 0;i<3;i++){
		for(let j=0; j<3;j++){
			if(board[i][j] == ''){
				board[i][j] = players[ai];
				let curScore = minimax(board, false, totMoves+1);
				board[i][j] = '';

				if(curScore > bestScore){
					bestScore = curScore;
					bestMove = {i, j};
				}
			}
		}
	}

	board[bestMove.i][bestMove.j] = players[ai];
}