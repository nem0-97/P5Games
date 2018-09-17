//TODO:maybe widen road and add obstacles? something like that cuberunner game?
//TODO:add 'turns' in road more variety?, maybe add forks?
//pre store some segments that work with eachother and randomly choose one to add when removing another?

class Car{//make way to "rotate" ship or fire from center of ship and
constructor(x,y,scal){
  this.x=x;
  this.y=y;
  this.scale=scal;
}

move(xDir,yDir,delta){//use delta
  this.x+=xDir*delta;
  this.y+=yDir*delta;
}
show(){
  fill(255,0,0);
  rect(this.x,this.y,this.scale,this.scale);
}
}

class Segment{
  constructor(xs,ys,speed){
    this.xs=xs;
    this.ys=ys;
    this.min=min(ys);
    this.speed=speed;
  }

  isOn(car){
    //car off screen is fine? (too high or too low) as long as it is in width of road since road is 'infinite' length
    return (car.x<min(this.xs)||car.x+car.scale>max(this.xs))
  }
  update(){
    for(let i=0;i<this.ys.length;i++){
      this.ys[i]+=this.speed;
    }
    //min y is in same index but is different number could just clac miny once in constructor and store its index
    this.min=min(this.ys);
  }
  show(){
    fill(0,255,0);
    beginShape();
    for(let i=0;i<this.xs.length;i++){
      vertex(this.xs[i],this.ys[i]);
    }
    endShape(CLOSE);
  }
}

let car;
let road;
let distance;
let scale=10;
let paused=false;

function keyPressed() {
  if (keyCode == RIGHT_ARROW) {
    car.move(1,0,10);
  } else if (keyCode == LEFT_ARROW) {
    car.move(-1,0,10);
  } else if (keyCode == UP_ARROW) {
    car.move(0,-1,10);
  } else if (keyCode == DOWN_ARROW) {
    car.move(0,1,10);
  } else if (keyCode == SHIFT) {
    paused = !paused;
  }
}

function newGame(){
  distance=0;
  car=new Car(width/2-scale/2,height/2-scale/2,scale);
  road=[new Segment([width/2-scale*10,width/2+scale*10,width/2+scale*10,width/2-scale*10],[-height,-height,0,0],5),new Segment([width/2-scale*10,width/2+scale*10,width/2+scale*10,width/2-scale*10],[0,0,height,height],5)];
}

function windowResized() {
  resizeCanvas(innerWidth,innerHeight);
  newGame();
}

function setup() {
  createCanvas(innerWidth,innerHeight);
  newGame();
}

function draw() {
  if(!paused){
    background(0);
    let go=true;//is game over?(car is off road)
    for(let i=road.length-1;i>=0;i--){
      road[i].update();
      road[i].show();
      if(road[i].isOn(car)){//check if car is on this section of road
        go=false;
      }
      if(road[i].min>height){//check if road segment went off screen
        road.splice(i,1);
        road.push(new Segment([width/2-scale*10,width/2+scale*10,width/2+scale*10,width/2-scale*10],[-height,-height,0,0],5));
      }
    }
    car.show();
    if(!go){
      newGame();
    }
  }
}
