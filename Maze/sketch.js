//TODO: Hold down key for moving

class Cell{
  constructor(i, j, w, l) {
    this.col = i;
    this.row = j;
    this.width = w;
    this.length = l;
    this.walls = [true, true, true, true];
    this.visited = false;
  }

  show(path){
    let x = this.col*this.width;
    let y = this.row*this.length;
    if(path=='n'){
      fill(255,0,0);
    }
    else if(path=='c'){
      fill(0,255,165);
    }
    else if(path=='s'){
      fill(255,165,0);
    }
    else if(path=='p'){
      fill(0,255,0);
    }
    else{//path=='e'
      fill(0,0,255);
    }

    noStroke();

    rect(x,y,this.width,this.length);

    stroke(0);
    if(this.walls[0]){
      line(x,y,x+this.width,y); //top
    }
    if(this.walls[1]){
      line(x,y,x,y+this.length); //left
    }
    if(this.walls[2]){
      line(x+this.width,y,x+this.width,y+this.length); //right
    }
    if(this.walls[3]){
      line(x,y+this.length,x+this.width,y+this.length); //bottom
    }
  }

  high(){
    let x = this.col*this.width;
    let y = this.row*this.length;
    noStroke();
    fill(255,0,0);
    rect(x,y,this.width,this.length);
  }

  search(cur){
    let borders = [];
    let top = cells[this.col][this.row-1];
    let left = cells[this.col-1];
    let right = cells[this.col+1];
    let bottom = cells[this.col][this.row+1];

    if(top && !top.visited){
      borders.push(top);
    }

    if(left && !left[this.row].visited){
      borders.push(left[this.row]);
    }

    if(right && !right[this.row].visited){
      borders.push(right[this.row]);
    }

    if(bottom && !bottom.visited){
      borders.push(bottom);
    }
    if(random.length>0){
      return random(borders);
    }
    else{
      return undefined;
    }
  }

  removeWall(border){
    if(border.col==this.col){
      if(border.row==(this.row-1)){
        this.walls[0] = false;
        border.walls[3] = false;
      }
      else{
        this.walls[3] = false;
        border.walls[0] = false;
      }
    }
    else{
      if(border.col==(this.col-1)){
        this.walls[1] = false;
        border.walls[2] = false;
      }
      else{
        this.walls[2] = false;
        border.walls[1] = false;
      }
    }
  }
}


let cols = 10;
let rows = 10;
let w,l;
let cells=[];
let current;
let stack =[];
let player=[0,0];
let checkpoints=[];

function genMaze(){
  let allVisited;
  while(!allVisited){
    allVisited=true;
    for(let i = 0;i<cols;i++){
      for(let j = 0;j<rows;j++){
        if(!cells[i][j].visited){
          allVisited=false;
          i=cols;
          break;
        }
      }
    }
    current.visited = true;
    //current.high();
    let next = current.search();
    if(next){
      stack.push(current);
      current.removeWall(next);
      current = next;
    }
    else{
      if(stack.length>0){
        current = stack.pop();
      }
    }
  }
}

function keyPressed() {
  if (keyCode == RIGHT_ARROW) {
    if(player[0]<cols-1&&!cells[player[0]][player[1]].walls[2]){
      player[0]++;
    }
  } else if (keyCode == LEFT_ARROW) {
    if(player[0]>0&&!cells[player[0]][player[1]].walls[1]){
      player[0]--;
    }
  } else if (keyCode == UP_ARROW) {
    if(player[1]>0&&!cells[player[0]][player[1]].walls[0]){
      player[1]--;
    }
  } else if (keyCode == DOWN_ARROW) {
    if(player[1]<rows-1&&!cells[player[0]][player[1]].walls[3]){
      player[1]++;
    }
  }
  else if (keyCode == SHIFT) {
    checkpoints.push(player.slice());
  }
  else if(key ==' '){
    if(checkpoints.length>0){
        player=checkpoints.pop();
    }
  }
}

function setup() {
  createCanvas(innerWidth,innerHeight);
  w = floor(width/cols);
  l = floor(height/rows);
  for(let i = 0 ; i<cols;i++){
    let temp = [];
    for(let j = 0;j<rows;j++){
      temp.push(new Cell(i,j,w,l));
    }
    cells.push(temp);
  }
  current = random(random(cells));
  genMaze();
}

function draw() {
  background(0);
  for(let i = 0;i<cols;i++){
    for(let j = 0;j<rows;j++){
      if(checkpoints.includes([i,j])){//fix this check
        cells[i][j].show('c');
      }
      else{
        cells[i][j].show('n');
      }
    }
  }
  cells[0][0].show('s');
  cells[cols-1][rows-1].show('e');
  cells[player[0]][player[1]].show('p');

  if(player[0]==cols-1&&player[1]==rows-1){
    for(let i = 0;i<cols;i++){
      for(let j = 0;j<rows;j++){
        cells[i][j].visited=false;
      }
    }
    current = random(random(cells));
    player=[0,0];
    genMaze();
  }

}
