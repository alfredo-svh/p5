// Made using p5.js library

// Double Spring System Simulation


// general
var gravity = 10;
var mass = 30;
var timeStep = 0.28;
var anchorX = 209;
var anchorY = 53;
var k = 2;
var d = 2;
var E = 0.8;

// mass 1
var m1posX = 89;
var m1posY = 180;
var m1velX = 0;
var m1velY = 0;
var m1springForceX;
var m1springForceY;
var m1dampingForceX;
var m1dampingForceY;
var m1forceX;
var m1forceY;
var m1accX;
var m1accY;

// mass 2
var m2posX = 85;
var m2posY = 0;
var m2velX = 0;
var m2velY = 0;
var m2springForceX;
var m2springForceY;
var m2dampingForceX;
var m2dampingForceY;
var m2forceX;
var m2forceY;
var m2accX;
var m2accY;


function setup() {
  createCanvas(400, 400);
}


function draw() {
  // Calculate Spring Force
  m1springForceX = -k * (m1posX - anchorX);
  m1springForceY = -k * (m1posY - anchorY);
  m2springForceX = -k * (m2posX - m1posX);
  m2springForceY = -k * (m2posY - m1posY);
  
  // Calculate Damping Force
  m1dampingForceX = d * m1velX;
  m1dampingForceY = d * m1velY;
  m2dampingForceX = d * m2velX;
  m2dampingForceY = d * m2velY;
  
  // Calculate Net Force
  m1forceX = m1springForceX - m1dampingForceX;
  m1forceY = m1springForceY + mass * gravity - m1dampingForceY;
  m2forceX = m2springForceX - m2dampingForceX;
  m2forceY = m2springForceY + mass * gravity - m2dampingForceY;
  
  // Calculate Acceleration
  m1accX = m1forceX / mass;
  m1accY = m1forceY / mass;
  m2accX = m2forceX / mass;
  m2accY = m2forceY / mass;
  
  // Update velocity
  m1velX += m1accX * timeStep;
  m1velY += m1accY * timeStep;
  m2velX += m2accX * timeStep;
  m2velY += m2accY * timeStep;
  
  // Update position
  m1posX += m1velX * timeStep;
  m1posY += m1velY * timeStep;
  m2posX += m2velX * timeStep;
  m2posY += m2velY * timeStep;
  
  // Calculate bouncing
  if(m2posY >= 390){
    m2posY = 390;
    if(m2velY > 0){
      m2velY = - (m2velY * E);
    }
  }

  // Draw static objects
  background(255);
  line(0, 400, 400, 400);
  rect(anchorX - 5, anchorY - 5, 10, 10);
  
  // Draw moving objects
  ellipse(m1posX, m1posY, 20, 20);
  line(m1posX, m1posY, anchorX, anchorY);
  ellipse(m2posX, m2posY, 20, 20);
  line(m1posX, m1posY, m2posX, m2posY);
}