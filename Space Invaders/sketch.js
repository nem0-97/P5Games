/*game over if:
1)  alien reaches ground?
2) tank gets hit once? or x number of times?
3)
level up when:
have destroyed level number of aliens?
score:
each alien destroyed:+=1?
each level:+=2?
on level up:
continuous stream? or with a pause between levels? aliens move faster on level up?
or
start with level number of aliens on screen?
*/

//TODO:fix so can hold down key to move and to steady fire? or only one shot at a time?
//TODO:Add bunkers?
//TODO:Add functionality of aliens shooting?


let tank;
let reset=false;
let projectiles=[];
let aliens=[];
let paused=false;
let level=1;
let scale=20;


class Projectile{
  constructor(x,y,xVel,yVel,scal,shooter){
    this.x=x;
    this.y=y;
    this.velX=xVel;
    this.velY=yVel;
    this.scale=scal;
    this.shooter=shooter;//use boolean since shooter is either tank or alien
  }

  update(){
    this.x+=this.velX;
    this.y+=this.velY;
  }

  show(){
    if(this.shooter){
      fill(255,165,0);
    }
    else{
      fill(0,0,255);
    }
    rect(this.x,this.y,this.scale,this.scale);
  }
}

class Alien{
  //movement is construct in top left, move right, drop down when reach end, move left, drop down when reach end,move right,etc.
  //move down as such until hits bunker,bunker gets destroyed? and alien does?, or reaches ground, game over?
  constructor(x,y,scal,lev){
    this.x=x;
    this.y=y;
    this.scale=scal;
    this.dir=1;
    this.level=lev;
  }

  shoot(){
    //when do aliens shoot? also what if they accidently shoot eachother? add variable to determine if alien fired or tank?
    //or make them fire at certain points where the rows beneath them won't get hit? first is easier
    return new Projectile(this.x+this.scale/2,this.y,0,-1,2,false);
  }

  landed(){
    if(this.y>=height-this.scale){
      return true;
    }
    return false;
  }

  update(){//also returns true if alien has reached ground false if not
    this.x+=this.dir*this.scale/frameRate();
    if(this.x+this.scale>width||this.x<0){//if alien is about to go off screen
      this.y+=this.scale+10;
      this.dir*=-1;
    }
  }

  show(){
    fill(255,0,0);
    rect(this.x,this.y,this.scale,this.scale);
  }
}

class Tank{
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
    return new Projectile(this.x+this.scale/2,this.y,0,-1,2,true);
  }

  show(){
    fill(0,255,0);
    rect(this.x,this.y,this.scale,this.scale);
  }
}

function collision(x1,y1,scale1,x2,y2,scale2){//for checking if tank or alien get hit
  if((x1<=x2&&x2<=x1+scale1)&&((y1<=y2&&y2<=y1+scale1)||(y2<=y1&&y1<=y2+scale2)) || (x2<=x1&&x1<=x2+scale2)&&((y1<=y2&&y2<=y1+scale1)||(y2<=y1&&y1<=y2+scale2))){
    return true;
  }
  return false;
}

function offScreen(x,y,scale){//check if fully offscreen
  if(x<0-scale||x>width||y>height||y<0-scale){
    return true;
  }
  return false;
}

function keyPressed() {
  //make it so you can hold down arrow keys and fire
  if (keyCode == RIGHT_ARROW) {
    tank.move(1,0,10);
  } else if (keyCode == LEFT_ARROW) {
    tank.move(-1,0,10);
  } else if (key == ' ') {
    projectiles.push(tank.fire());
  } else if (keyCode == SHIFT) {
    paused = !paused;
  }
  //if want to change game and let 'tank' move 4 directions
  /*else if (keyCode == UP_ARROW) {
    tank.move(0,-1,1);
  } else if (keyCode == DOWN_ARROW) {
    tank.move(0,1,1);
  }*/
}

function windowResized() {
  resizeCanvas(innerWidth,innerHeight);
  gameOver();
}

function setup() {
  createCanvas(innerWidth,innerHeight);
  tank=new Tank(width/2,height-scale,scale);
  aliens.push(new Alien(10,10,scale));
}

function gameOver(){
  tank=new Tank(width/2,height-scale,scale);
  projectiles=[];
  aliens=[];
  level=1;
  reset=true;
}

function draw() {
  if(!paused){
    background(0);

    for(let i=projectiles.length-1;i>=0;i--){//update,show,and remove projectiles if they are off screen
      projectiles[i].update();
      if(!offScreen(projectiles[i].x, projectiles[i].y, projectiles[i].scale)){
        projectiles[i].show();
        if(projectiles[i].shooter){
          //check if it hit an alien or the tank, if hit alien remove alien and projectile, if hit tank game over
          let j=aliens.length-1;
          let hit=false;
          while(j>=0 && !hit){
            if(collision(aliens[j].x,aliens[j].y,aliens[j].scale,projectiles[i].x, projectiles[i].y, projectiles[i].scale)){
              aliens.splice(j,1);
              projectiles.splice(i,1);
              hit=true;
            }
            j--;
          }
        }
        else if(collision(tank.x,tank.y,tank.scale,projectiles[i].x, projectiles[i].y, projectiles[i].scale)){
          gameOver();
          break;
        }
      }
      else{
        projectiles.splice(i,1);
      }
    }

    tank.show();

    for(let i=0;i<aliens.length;i++){
      aliens[i].update();
      aliens[i].show();
      if(aliens[i].landed()){
        //end game
        gameOver();
      }
    }

    if(aliens.length==0){//level up or reset if game ended on alien reaching ground
      if(!reset){
        level++;
      }
      else{
        reset=false;
      }
      for(let i=0;i<level;i++){
        aliens.push(new Alien(i*30+10,10,scale));
      }
    }
  }
}
