let resolution = 10;
let cols;
let rows;
let grid;
let next;

function createGrid(){
	let arr = new Array(rows);
	
	for(let i = 0; i< arr.length; i++){
		arr[i] = new Array(cols);
	}
	
	return arr
}

function countNeighbors(y, x){
	let sum = 0;
	for(let i= y-1; i<= y+1; i++){
		if( i>=0 && i< rows){
			for(let j = x-1; j<=x+1; j++){
				if(j>=0 && j< cols){
					sum+= grid[i][j];
				}
			
			}
		}
	}
	
	return sum - grid[y][x];
}

function computeNext(){
	next = createGrid();
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {

      let neighbors = countNeighbors(i, j);
	  
	  if(neighbors == 3 || (neighbors == 2 && grid[i][j] == 1)){
		  next[i][j] = 1;
	  }
	  else{
		  next[i][j] = 0;
	  }
    }
  }
}


function setup() {
	frameRate(10);
  createCanvas(1900, 900);
  
  cols = width / resolution;
  rows = height / resolution;
  
  grid = createGrid();
  
  // first generation (random)
  for(let i=0; i < rows; i++){
	for(let j=0; j < cols; j++){
		grid[i][j] = floor(random(2));
	}
  }
}

function draw() {
  // put drawing code here
  background(0);
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
		let x = j * resolution;
		let y = i * resolution;
		if (grid[i][j] == 1) {
			fill(255);
			stroke(0);
			rect(x, y, resolution - 1, resolution - 1);
		}
    }
  }
  
  computeNext()
  
  grid = next
}