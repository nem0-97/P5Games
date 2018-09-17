
//TODO:allow holding down of movement keys?

class Ball{
  constructor(x,y,xVel,yVel,scale){
    this.x=x;
    this.y=y;
    this.velX=xVel;
    this.velY=yVel;
    this.scale = scale;
  }

  scored(){//check if ball went offscreen()
    if(this.x<0-scale){
      return 'p1'; //p1 scored
    }
    else if(this.x>width){
      return 'p0';//p0 scored
    }
    return 'na';//nobody scored
  }

  update(){//add check to make it bounce off top and bottom of screen
    this.x+=this.velX;
    this.y+=this.velY;
    if(this.y<=0||this.y>=height-this.scale){
      this.velY*=-1;
    }
  }

  show(){
    fill(0,255,0);
    rect(this.x, this.y, this.scale, this.scale);
  }
}

class Paddle{//movement will occur in keypressed so no update
  constructor(x,y,player,scale){//player is true if player 0 false if player1(just for color of paddles)
    this.x=x;
    this.y=y;
    this.p0=player;
    this.scale=scale;
  }
  move(deltaX,deltaY){
    this.x+=deltaX;
    this.y+=deltaY;
  }

  bounce(test){
    //using else if just incase ball hits 2 segments this will only effect its velocity once
    if(collision(test.x,test.y,test.scale,test.scale,this.x,this.y,this.scale,this.scale)){//ball hit top segment
      test.velX*=-1;
      test.velY+=1;
    }
    else if(collision(test.x,test.y,test.scale,test.scale,this.x,this.y+this.scale,this.scale,this.scale)){//ball hit second from top
      test.velX*=-1;
      test.velY+=.5;
    }
    else if(collision(test.x,test.y,test.scale,test.scale,this.x,this.y+2*this.scale,this.scale,this.scale)){//ball hit middle
      test.velX*=-1;
    }
    else if(collision(test.x,test.y,test.scale,test.scale,this.x,this.y+3*this.scale,this.scale,this.scale)){//ball hit 2nd bottom
      test.velX*=-1;
      test.velY-=.5;
    }
    else if(collision(test.x,test.y,test.scale,test.scale,this.x,this.y+4*this.scale,this.scale,this.scale)){//ball hit bottom
      test.velX*=-1;
      test.velY-=1;
    }
    //ball didn't hit paddle
  }

  show(){//so can have different colors for each paddle?
    if(this.p0){
      fill(255,0,0);
    }
    else{
      fill(0,0,255);
    }
    rect(this.x, this.y, this.scale, this.scale*5);
    //have the height be 5times the width of paddle(gonna have to change collision function)
  }
}

function collision(x1,y1,xscale1,yscale1,x2,y2,xscale2,yscale2){
  if((x1<=x2&&x2<=x1+xscale1)&&((y1<=y2&&y2<=y1+yscale1)||(y2<=y1&&y1<=y2+yscale2)) || (x2<=x1&&x1<=x2+xscale2)&&((y1<=y2&&y2<=y1+yscale1)||(y2<=y1&&y1<=y2+yscale2))){
    return true;
  }
  return false;
}

let players=[];
let points=[0,0];
let ball;
let scale=10;
let paused=false;

function keyPressed() {
  if (keyCode == UP_ARROW) {//decide on speed to move and allow key to be held down?
    players[0].move(0,-scale);
  } else if (keyCode == DOWN_ARROW) {
    players[0].move(0,scale);
  } else if (key == 'W') {
    players[1].move(0,-scale);
  }else if (key == 'S') {
    players[1].move(0,scale);
  } else if (keyCode == SHIFT) {
    paused = !paused;
  }
  else if(key==' '){//start new game
    ball=new Ball(width/2,height/2,-4,0,scale);
    players=[];
    players.push(new Paddle(20,height/2-scale/2,true,scale));
    players.push(new Paddle(width-20,height/2-scale/2,false,scale));
    points=[0,0];
  }
}

function windowResized() {
  resizeCanvas(innerWidth,innerHeight);
  ball=new Ball(width/2,height/2,-4,0,scale);
  players=[];
  players.push(new Paddle(20,height/2-scale/2,true,scale));
  players.push(new Paddle(width-20,height/2-scale/2,false,scale));
  points=[0,0];
}

function setup() {
  createCanvas(innerWidth,innerHeight);
  ball=new Ball(width/2,height/2,-4,0,scale);
  players.push(new Paddle(20,height/2-scale/2,true,scale));
  players.push(new Paddle(width-20,height/2-scale/2,false,scale));
}

function draw() {
  if(!paused){
    background(0);
    ball.update();
    ball.show();

    for(let i=0;i<players.length;i++){//just 2 paddles no real need for array and loop but eh.
      players[i].show();
      //check for collisions and adjust balls velocity depending
      players[i].bounce(ball);
    }

    //check for a score
    let check=ball.scored();
    if(check!='na'){
      if(check=='p0'){
        points[0]++;
      }else{
        points[1]++;
      }
      //keep balls velocity but just move it to center to reset
      ball.x=width/2;
      ball.y=height/2;
    }
    //show score
    textSize(32);
    fill(255,165,0);
    text(points[0],width/2-50,30);
    text(points[1],width/2+50,30);
  }
}
