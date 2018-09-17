//snake:
//  arrray for head and tail
//  length
//  velocity
//  segment size

//Item:
//  position and size (food is a 'subclass' of this, can also add powerups as Items if want)

//TODO:Maybe restrict user to stay on screen?
      //(not neceessary, and also what to do? kill them if go off? reset position? auto turn them? come back on opposite side?)

//TODO:Add scoring system(each time you eat a food score+=1 and score+=level when you complete it)?

//TODO:Maybe increase speed each level/food (frameRate+=1 if food, then frameRate=10+5*(level-1) if level)?
        //comeup with some high bound on speed? or just let it be?

//TODO:Add powerups that slow you down? speed you up? for sometime score increases 2x for each food

let snake;
let level=1;
let food=[];
let paused = false;
let scal=10;

class Item{
  constructor(x,y,scale){
    this.x = x;
    this.y = y;
    this.scale=scale;
  }
  show(){
    fill(255,0,0);
    rect(this.x, this.y, this.scale, this.scale);
  }
}

class Snake {//maybe add getHead function?
  constructor(x, y, xVel, yVel, len, scale) {
    this.length=1;
    this.tail=[];
    this.tail.push(createVector(x,y));
    for(let i=1;i<len;i++){
      this.grow;
    }
    this.velX=xVel;
    this.velY=yVel;
    this.scale = scale;
  }
  update() {
    this.tail.push(createVector(this.tail[this.length-1].x+this.velX*this.scale,this.tail[this.length-1].y+this.velY*this.scale));
    this.tail.shift();
  }

  getHead(){
    return this.tail[snake.length-1];
  }

  setVel(xVel,yVel){
    this.velX=xVel;
    this.velY=yVel;
  }

  grow(){
    this.length++;
    this.tail.push(this.tail[this.tail.length-1].copy());
  }

  gameOver(){
    for(let i=0;i<this.tail.length-1;i++){
      if(collision(this.tail[this.length-1].x,this.tail[this.length-1].y,this.tail[i].x,this.tail[i].y,this.scale)){
        return true;
      }
    }
    return false;
  }

  show() {
    fill(0,255,0);
    for(let i=0;i<this.tail.length-1;i++){
      rect(this.tail[i].x,this.tail[i].y,this.scale,this.scale);
    }
    //make head blue
    fill(0,0,255);
    rect(this.tail[this.length-1].x,this.tail[this.length-1].y,this.scale,this.scale);
  }
}

function keyPressed() {
  //don't make turns if turning into edge
  if (keyCode == RIGHT_ARROW) {
    snake.setVel(1,0);
  } else if (keyCode == LEFT_ARROW) {
    snake.setVel(-1,0);
  } else if (keyCode == UP_ARROW) {
    snake.setVel(0,-1);
  } else if (keyCode == DOWN_ARROW) {
    snake.setVel(0,1);
  } else if (keyCode == SHIFT) {
    paused = !paused;
  }
}

function collision(x1,y1,x2,y2,scale){
  if((x1<=x2&&x1+scale>x2&&((y1<=y2&&y1+scale>y2)||(y2<=y1&&y2+scale>y1)))||(x2<=x1&&x2+scale>x1&&((y1<=y2&&y1+scale>y2)||(y2<=y1&&y2+scale>y1)))){
    return true;
  }
  return false;
}

function windowResized() {
  resizeCanvas(innerWidth,innerHeight);
  level=1;
  food=[new Item(random(width-scal),random(height-scal),scal)];
  snake=new Snake(width / 2, height / 2, 0, 0, 1, scal);
}

function setup() {
  createCanvas(innerWidth, innerHeight);
  food.push(new Item(random(width-scal),random(height-scal),scal));
  snake=new Snake(width / 2, height / 2, 0, 0, 1, scal);
  frameRate(30);
}

function draw() {
  if (!paused) {
    background(0);


    //show food then check if any food has been eaten
    let head=snake.getHead();
    for(let i=food.length-1;i>=0;i--){
      food[i].show();
      if(collision(head.x,head.y,food[i].x,food[i].y,scal)){//if snake head collides with food
        food.splice(i,1);
        snake.grow();
      }
    }

    //check if all food is eaten and need to move to next 'level'
    if(food.length==0){
      level++;
      for(let i=0;i<level;i++){
        food.push(new Item(random(width-scal),random(height-scal),scal));
      }
    }

    //update snake and draw it
    snake.update();
    snake.show();

    //check if game is over (snake collided with part of its tail)
    if(snake.gameOver()){
      level=1;
      food=[new Item(random(width-scal),random(height-scal),scal)];
      snake=new Snake(width / 2, height / 2, 0, 0, 1, scal);
    }
  }
}
