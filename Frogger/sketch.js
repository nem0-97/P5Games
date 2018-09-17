//TODO: figure out spacing of lanes so they fill up the whold field
//TODO: implement key held down(have move function called when you press down a key have while(!keyRealeased) loop? make async?)

class Car{//only need xVel for frogger game
  constructor(x,y,xVel,scale){
    this.x=x;
    this.y=y;
    this.scale=scale;
    this.velX=xVel;
  }
  update(){
    this.x+=this.velX;
    if(this.x<0-this.scale){
      this.x=width;
    }
    else if(this.x>width){//once it finishes crossing screen have it go back to where it started
      this.x=0-this.scale;
    }
  }
  show(){
    if(this.velX>0){
      fill(255,0,0);
    }
    else{
      fill(0,0,255);
    }
    rect(this.x,this.y,this.scale,this.scale);
  }
}

class Frog{
  constructor(x,y,scale){
    this.x=x;
    this.y=y;
    this.scale=scale;
  }
  move(deltaX,deltaY){
    if(!(this.x+deltaX>width-this.scale||this.x+deltaX<0)&&!(this.y+deltaY>height-this.scale)){
      this.x+=deltaX;
      this.y+=deltaY;
    }
  }
  isSafe(){
    return (this.y<=0);
  }
  show(){
    fill(0,255,0);
    rect(this.x,this.y,this.scale,this.scale);
  }
}

function collision(x1,y1,xscale1,yscale1,x2,y2,xscale2,yscale2){
  return((x1<=x2&&x2<=x1+xscale1)&&((y1<=y2&&y2<=y1+yscale1)||(y2<=y1&&y1<=y2+yscale2)) || (x2<=x1&&x1<=x2+xscale2)&&((y1<=y2&&y2<=y1+yscale1)||(y2<=y1&&y1<=y2+yscale2)));
}

let frog;
let lanes;
let cars;
let scale=10;
let paused=false;

function keyPressed() {//allow to move down?
  if (keyCode == UP_ARROW) {
    frog.move(0,-scale);
  } else if (keyCode == LEFT_ARROW) {
    frog.move(-scale,0);
  } else if (keyCode == RIGHT_ARROW) {
    frog.move(scale,0);
  }else if (keyCode == DOWN_ARROW) {
    frog.move(0,scale);
  } else if (keyCode == SHIFT) {
    paused = !paused;
  }
}

function newGame(){
  lanes=4;
  levelUp();
}

function levelUp(){
  lanes++;
  cars=[];
  frog=new Frog(width/2-scale,height-scale,scale);
  for(let i=0;i<lanes;i++){
    var xVel=scale/6;
    if(i%2==0){//every other lane switches direction
      xVel*=-1;
    }
    let y=i*scale*7;//fix y figure out what it should be
    for(let j=0;j<width/(10*scale);j++){
      cars.push(new Car(j*(10*scale),y,xVel,scale));//leaves a 2*scale gap between each cars for frog to get through
    }
  }
}

function windowResized() {
  resizeCanvas(innerWidth,innerHeight);
  newGame();
}

function setup() {//have more lanes each level?level=lanes-4 or have cars speed up? or both? each level up increase score by that level?
  createCanvas(innerWidth,innerHeight);
  newGame();
}

function draw() {
  if(!paused){
    background(0);
    frog.show();
    for(let i=0;i<cars.length;i++){
      cars[i].update();
      cars[i].show();
      if(collision(cars[i].x,cars[i].y,cars[i].scale,cars[i].scale,frog.x,frog.y,frog.scale,frog.scale)){
        newGame();
      }
    }
    if(frog.isSafe()){
      levelUp();
    }
  }
}
