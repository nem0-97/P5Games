//TODO: make ship triangle and fire from tip
//TODO: add ship rotation
//TODO: add hold down keys

class Projectile{
  constructor(x,y,xVel,yVel,scal){
    this.x=x;
    this.y=y;
    this.velX=xVel;
    this.velY=yVel;
    this.scale=scal;
  }

  update(){
    this.x+=this.velX;
    this.y+=this.velY;
  }
  offScreen(){
    return (this.x<-this.scale||this.x>width||this.y>height||this.y<-this.scale);
  }

  show(){
    fill(255,165,0);
    rect(this.x,this.y,this.scale,this.scale);
  }
}

class Asteroid{
  constructor(x,y,xVel,yVel,scal){
    this.x=x;
    this.y=y;
    this.velX=xVel;
    this.velY=yVel;
    this.scale=scal;
  }

  update(){
    this.x+=this.velX;
    this.y+=this.velY;
    if(this.x<0||this.x>width-this.scale){
      this.velX*=-1
    }
    if(this.y>height-this.scale||this.y<0){
      this.velY*=-1
    }
  }

  show(){
    fill(0,255,0);
    rect(this.x,this.y,this.scale,this.scale);
  }
}

class Ship{//make way to "rotate" ship or fire from center of ship and
  constructor(x,y,scal){
    this.x=x;
    this.y=y;
    this.scale=scal;
  }

  move(xDir,yDir,delta){//use delta
    this.x+=xDir*delta;
    this.y+=yDir*delta;
  }

  fire(){
    return new Projectile(this.x+this.scale/2,this.y,0,-1,2);
  }

  show(){
    fill(255,0,0);
    rect(this.x,this.y,this.scale,this.scale);
  }
}

function collision(x1,y1,xscale1,yscale1,x2,y2,xscale2,yscale2){
  return((x1<=x2&&x2<=x1+xscale1)&&((y1<=y2&&y2<=y1+yscale1)||(y2<=y1&&y1<=y2+yscale2)) || (x2<=x1&&x1<=x2+xscale2)&&((y1<=y2&&y2<=y1+yscale1)||(y2<=y1&&y1<=y2+yscale2)));
}

let ship;
let asteroids;
let projectiles;
let level;
let scale=10;
let paused=false;

function keyPressed() {
  if (keyCode == RIGHT_ARROW) {
    ship.move(1,0,10);
  } else if (keyCode == LEFT_ARROW) {
    ship.move(-1,0,10);
  } else if (keyCode == UP_ARROW) {
    ship.move(0,-1,10);
  } else if (keyCode == DOWN_ARROW) {
    ship.move(0,1,10);
  } else if (key == ' ') {
    projectiles.push(ship.fire());
  } else if (keyCode == SHIFT) {
    paused = !paused;
  }
}

function levelUp(){
  projectiles=[];
  level++;
  ship=new Ship(width/2-scale/2,height/2-scale/2,scale,0,0);
  asteroids=[];
  for(let i=0;i<level;i++){
    asteroids.push(new Asteroid(random(width),random(height),random(5),random(5),scale));
  }
}

function newGame(){
  level=0;
  levelUp();
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
    ship.show();
    for(let j=projectiles.length-1;j>=0;j--){//maybe move update and show into own loop so the only run once every draw
      projectiles[j].update();
      projectiles[j].show();
    }
    for(let i=asteroids.length-1;i>=0;i--){
      asteroids[i].update();
      asteroids[i].show();
      if(collision(asteroids[i].x,asteroids[i].y,asteroids[i].scale,asteroids[i].scale,ship.x,ship.y,ship.scale,ship.scale)){
        newGame();
        break;
      }
      for(let j=projectiles.length-1;j>=0;j--){//maybe move update and show into own loop so the only run once every draw
        if(collision(asteroids[i].x,asteroids[i].y,asteroids[i].scale,asteroids[i].scale,projectiles[j].x,projectiles[j].y,projectiles[j].scale,projectiles[j].scale)){
          asteroids.splice(i,1);
          projectiles.splice(j,1);
          break;
        }
        if(projectiles[j].offScreen()){
          projectiles.splice(j,1);
        }
      }
    }
    if(asteroids.length==0){
      levelUp();
    }
  }
}
