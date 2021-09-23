let vehicles = [];
let food = [];
let poison = [];
let foodRate;
let healthDe;
let maxspeed;
let createV;
let mr;
let reproductionRate;

let debug;

function setup() {
  createCanvas(640, 360);

  createP("Debug: ");
  debug = createCheckbox();
  createP("Food Rate: ");
  foodRate = createSlider(0.001, 0.2, 0.1, 0.001);
  createP("Health Rate: ");
  healthDe = createSlider(0, 0.014, 0.007, 0.0001);
  createP("Max speed: ");
  maxspeed = createSlider(1, 10, 5, 0.1);
  createP("Mutation rate: ");
  mr = createSlider(0, 1, 0.1, 0.001);
  createP("Reproduction rate: ");
  reproductionRate = createSlider(0, 0.03, 0.003, 0.0001);
  createP();
  createV = createButton("Add vehicle");

  for (let i = 0; i < 50; i++) {
    let x = random(width);
    let y = random(height);
    vehicles.push(new Vehicle(x, y));
  }

  for (let i = 0; i < 40; i++) {
    let x = random(width);
    let y = random(height);
    food.push(createVector(x, y));
  }

  for (let i = 0; i < 10; i++) {
    let x = random(width);
    let y = random(height);
    poison.push(createVector(x, y));
  }
}

function createVehicle() {
  let x = random(width);
  let y = random(height);
  vehicles.push(new Vehicle(x, y));
}

function draw() {
  background(51);

  createV.mousePressed(createVehicle)

  if (random(1) < foodRate.value()) {
    let x = random(width);
    let y = random(height);
    food.push(createVector(x, y));
  }
  
  if (random(1) < 0.01) {
    let x = random(width);
    let y = random(height);
    poison.push(createVector(x, y));
  }

  for (let i = 0; i < food.length; i++) {
    fill(0, 255, 0);
    noStroke();
    circle(food[i].x, food[i].y, 5)
  }
  for (let i = 0; i < poison.length; i++) {
    fill(255, 0, 0);
    noStroke();
    circle(poison[i].x, poison[i].y, 5)
  }

  for (let i = vehicles.length - 1; i >= 0; i--) {
    let v = vehicles[i];
    v.boundaries();
    v.behaviors(food, poison);
    v.update();
    v.display();

    let newVehicle = v.clone();
    if (newVehicle != null) {
      vehicles.push(newVehicle);
    }

    if (v.dead()) {
      food.push(createVector(v.position.x, v.position.y));
      vehicles.splice(i, 1);

    }
  }
}