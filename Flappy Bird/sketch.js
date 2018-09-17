//TODO: maybe make obstacle object include '2 obstacles' and have gap at random spot with random size to make it look more interesting



class Bird{
  constructor(x,y,scale,grav){
    this.x=x;
    this.y=y;
    this.scale=scale;
    this.grav=grav;
  }

  flap(){
    this.y-=40*this.grav;
  }

  update(){
    this.y+=this.grav;
  }

  show(){
    fill(255,165,0);
    rect(this.x,this.y,this.scale,this.scale);
  }
}

class Obstacle{
  constructor(x,y,scale,len,vel){
    this.x=x;
    this.y=y;
    this.scale=scale;
    this.len=len;
    this.vel=vel;
  }
  update(){
    this.x-=this.vel;
  }
  offscreen(){
    return (this.x<-this.scale);
  }
  show(){
    fill(255,0,0);
    rect(this.x,this.y,this.scale,this.len);
  }
}


function collision(x1,y1,xscale1,yscale1,x2,y2,xscale2,yscale2){
  return((x1<=x2&&x2<=x1+xscale1)&&((y1<=y2&&y2<=y1+yscale1)||(y2<=y1&&y1<=y2+yscale2)) || (x2<=x1&&x1<=x2+xscale2)&&((y1<=y2&&y2<=y1+yscale1)||(y2<=y1&&y1<=y2+yscale2)));
}

let bird;
let obstacles;
let scale=10;
let paused=false;

function keyPressed() {//allow to move down?
  if (key == ' ') {
    bird.flap();
  } else if (keyCode == SHIFT) {
    paused = !paused;
  }
}

function newGame(){
  bird=new Bird(10,height/2-scale/2,scale,scale/20);
  obstacles=[];
  for(let i=0;i<(width-10-4*scale)/(4*scale);i++){
    let x=(i+1)*4*scale+10;
    obstacles.push(new Obstacle(x,0,scale,random(0,(height/2-2*scale)),1));
    let h=random(0,(height/2-2*scale));
    obstacles.push(new Obstacle(x,height-h,scale,h,1));
  }
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
    bird.show();
    bird.update();
    for(let i=obstacles.length-1;i>=0;i--){
      obstacles[i].update();
      obstacles[i].show();
      if(collision(obstacles[i].x,obstacles[i].y,obstacles[i].scale,obstacles[i].len,bird.x,bird.y,bird.scale,bird.scale)){//collide with bird
        newGame();
        break;
      }
      //remove this obstacle and push new one with random height into obstacles(could just make obstacle update function move it to end of screen but this adds variety)
      if(obstacles[i].offscreen()){
        let h=random(0,(height/2-2*scale));
        let y=0;
        if(obstacles[i].y!=0){
          y=height-h;
        }
        obstacles.push(new Obstacle(obstacles[obstacles.length-1].x+4*scale,y,scale,h,1));
        obstacles.splice(i,1);
      }

    }
  }
}
