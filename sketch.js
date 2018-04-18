var ball;
var totalRealHeight = 3; //in meter
var totalRealWidth = 3; //in meter

var density = 0; //air
//var density = 1.225; //air
// var density = 1000; //water

var accGravity;

//var cordinatesGraphic;

var startButton;

var startSym = true;


function setup() {
  createCanvas(windowWidth, windowHeight);
  
  startButton=createButton('Start');
  startButton.mousePressed(startSim);

  ball = new Ball(color(random(255), random(255), random(255)));
  noStroke();
  // cordinatesGraphic=createGraphics(width,height);
  // cordinatesGraphic.pixelDensity(1)
  addCordinates();
  
  accGravity=createVector(0,9.8);
  
 
   
   //elastisitySlider.mousePressed();
  
}
function startSim(){
  if(!startSym){
  	startSym=true;
  }else{
    ball.divs.remove();
    ball=new Ball(
      color(random(255),random(255),random(255)));
  }
}

function addCordinates(){
  // cordinatesGraphic.textFont('Helvetica');
  // cordinatesGraphic.textSize(15);
  // cordinatesGraphic.strokeWeight(0);
  // cordinatesGraphic.noStroke();
  // cordinatesGraphic.fill(255,0,0)
  // var numMarks=10
  // for(var i=1;i<numMarks;i++){
  //   cordinatesGraphic.line(0,height/(numMarks)*i,8,height/(numMarks)*i);
  //   cordinatesGraphic.text(round(
  //     totalRealHeight*100-(totalRealHeight/
  //       (numMarks))*i*100)/100,
  //     10,height/(numMarks)*i)
  //   //console.log(3/(numMarks)*i)
  // }
  background(0);
  
}

function draw() {
  if (frameRate() && startSym) {
    background(0,5);

    ball.applyForces();
    //console.log(ball.pos.x)
    //if(ball.pos.y>1)
    ball.accelerate();
    ball.move();
    ball.bounce();
    ball.display();
    
    // image(cordinatesGraphic,0,0,width,height);
  }
}

function changeDensity(){
  //density=log(ball.densitySlider.value());
  density=pow(10,ball.densitySlider.value());
  // console.log(density + " : " + ball.densitySlider.value());
  if(density<=.011){
    density=0;
  }
  ball.divDensity.html('Density: ' + 
                       density);
  
  
}
function Ball(colorIn) {
  this.elasticity = 1;
  this.color = colorIn;
  this.diam = 0.041;
  this.mass = 0.045;
  this.dragConstant = 0.4; //between .5 and .1 for ball
  this.pos = createVector(totalRealWidth * 0.3, totalRealHeight * 0.1);

  this.vel = createVector(1, 0);
  this.pvel;

  this.acc = createVector(0, .98);
	this.divs=createDiv("");
  this.divElasitisity=createDiv('Elasticity');
  this.divElasitisity.parent(this.divs);
	this.elastisitySlider = createSlider(0, 1, 1, 0.01);
	this.elastisitySlider.parent(this.divs);
  this.divDensity=createDiv('Density '+ 
                       density);
  this.divDensity.parent(this.divs);
  console.log(density + "  : " + log(density));
  this.densitySlider = createSlider(-2, 3, log(density),0.0001);
	this.densitySlider.parent(this.divs);
  this.densitySlider.mouseReleased(changeDensity);
  
  this.move = function() {

    this.pos.y = this.pos.y + ((this.pvel.y + this.vel.y) / 2) / frameRate()
    this.pos.x = this.pos.x + ((this.pvel.x + this.vel.x) / 2) / frameRate()
    
    if(this.pos.y>totalRealHeight - this.diam / 2){
      var pposition=this.pos.y - ((this.pvel.y + this.vel.y) / 2) / frameRate();
      // entripolate
      var percentOver=map(totalRealHeight - this.diam / 2, 
                          pposition,this.pos.y,
                          0,1);
          
          //abs((this.pos.y-totalRealHeight - this.diam / 2)/(pposition-this.pos.y))
      
      //console.log(map(percentOver,0,1,this.pvel.y,this.vel.y) + " ?? " + this.pvel.y + " / " +this.vel.y);
      this.vel.y=map(percentOver,0,1,this.pvel.y,this.vel.y)
      this.pos.y=totalRealHeight - this.diam / 2;
      
      // console.log(pposition + " : : " + (totalRealHeight - this.diam / 2) + " : " + this.pos.y);
      // console.log(percentOver);
    }
  }
  this.accelerate = function() {

    this.pvel = createVector(this.vel.x, this.vel.y)
    this.vel.y = this.vel.y + this.acc.y / frameRate()

  }

  this.applyForces = function() {
    //f=ma
    this.acc.x = (accGravity.x*this.mass-0.5 * density * this.dragConstant *
      pow(this.diam / 2, 2) * PI *
      this.vel.x * abs(this.vel.x)) / this.mass;

    	this.acc.y = (accGravity.y*this.mass - 0.5 * density * this.dragConstant *
        pow(this.diam / 2, 2) * PI *
        this.vel.y * abs(this.vel.y)) / this.mass;
    
    
// console.log(this.acc.y*this.mass +"  :  " + 
        //     ( - 0.5 * density * this.dragConstant *
        // pow(this.diam / 2, 2) * PI *
        // this.vel.y * abs(this.vel.y)));


  }

  this.bounce = function() {
    if (this.pos.x >= totalRealWidth - this.diam / 2) {
      this.vel.x = -abs(this.vel.x) * this.elastisitySlider.value();
      //this.pos.x=0+totalRealWidth-this.diam/2;
    }
    if (this.pos.x <= 0 + this.diam / 2) {
      this.vel.x = abs(this.vel.x) * this.elastisitySlider.value();
      //this.pos.x=0+this.diam/2;
    }
    if (this.pos.y >= totalRealHeight - this.diam / 2) {

      this.vel.y = -abs(this.vel.y) * this.elastisitySlider.value();


      //this.pos.y=totalRealHeight-this.diam/2;
      //console.log(this.vel.y);
    }
    if (this.pos.y <= 0 + this.diam / 2) {
      this.vel.y = abs(this.vel.y) * this.elastisitySlider.value();
      //this.pos.y=this.diam/2;
    }
  }

  this.display = function() {
    stroke(this.color);
    // fill(this.color);
    //console.log(map(this.pos.x,0,totalRealHeight,0,width))
  //   ellipse(
  //     map(this.pos.x, 0, totalRealWidth, 0, width),
  //     map(this.pos.y, 0, totalRealHeight, 0, height),
  //     map(this.diam, 0, totalRealHeight, 0, height),
  //     map(this.diam, 0, totalRealHeight, 0, height));

  line(
      map(this.pos.x, 0, totalRealWidth, 0, width),
      map(this.pos.y, 0, totalRealHeight, 0, height),
      mouseX,
      mouseY);
  
}
}