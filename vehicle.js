class Vehicle {
  constructor(x, y, dna) {
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, -2);
    this.position = createVector(x, y);
    this.r = 5;
    this.maxspeed = 5;
    this.maxforce = 0.5;
    this.health = 1;
    this.dna = [];
    if (dna === undefined) {
      this.dna[0] = random(-2, 2);
      this.dna[1] = random(-2, 2);
      this.dna[2] = random(this.maxspeed, 100);
      this.dna[3] = random(this.maxspeed, 100);
    } else {
      this.dna[0] = dna[0];
      if (random(1) < mr.value()) {
        this.dna[0] += random(-0.1, 0.1);
      }
      this.dna[1] = dna[1];
      if (random(1) < mr.value()) {
        this.dna[1] += random(-0.1, 0.1);
      }
      this.dna[2] = dna[2];
      if (random(1) < mr.value()) {
        this.dna[2] += random(-10, 10);if (this.dna[2] < maxspeed) {
          this.dna[2] = maxspeed;
        }
      }
      this.dna[3] = dna[3];
      if (random(1) < mr.value()) {
        this.dna[3] += random(-10, 10);
        if (this.dna[3] < maxspeed) {
          this.dna[3] = maxspeed;
        }
      }
    }
  }

  clone() {
    if (random(1) < reproductionRate.value()) {
      return new Vehicle(this.position.x, this.position.y, this.dna);
    } else {
      return null;
    }
  }

  // Method to update location
  update() {
    this.health -= healthDe.value();
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelerationelertion to 0 each cycle
    this.acceleration.mult(0);
  }

  applyForce(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  }

  behaviors(good, bad) {
    let steerG = this.eat(good, 0.3, this.dna[2]);
    let steerB = this.eat(bad, -0.75, this.dna[3]);

    steerG.mult(this.dna[0]);
    steerB.mult(this.dna[1]);

    this.applyForce(steerG);
    this.applyForce(steerB);
  }

  eat(list, nutrition, perception) {
    let record = Infinity;
    let closestIndex = null;
    for (let i = 0; i < list.length; i++) {
      let d = p5.Vector.dist(this.position, list[i]);
      if (d < record && d < perception) {
        record = d;
        closestIndex = i;
      }
    }
    if (record < 5) {
      list.splice(closestIndex, 1);
      this.health += nutrition;
    } else if (closestIndex > -1 && list[closestIndex]) {
      return this.seek(list[closestIndex]);
    }

    return createVector(0, 0);
  }

  dead() {
    return (this.health < 0);
  }

  // A method that calculates a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  seek(target) {

    var desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target

    // Scale to maximum speed
    desired.setMag(this.maxspeed);

    // Steering = Desired minus velocity
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force

    return steer;
  }

  boundaries() {
    let d = 10;
    let desired = null;
    if (this.position.x < d) {
      desired = createVector(this.maxspeed, this.velocity.y);
    } else if (this.position.x > width - d) {
      desired = createVector(-this.maxspeed, this.velocity.y);
    }

    if (this.position.y < d) {
      desired = createVector(this.velocity.x, this.maxspeed);
    } else if (this.position.y > height - d) {
      desired = createVector(this.velocity.x, -this.maxspeed);
    }

    if (desired !== null) {
      desired.setMag(this.maxspeed);
      var steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }
  }

  display() {
    // Draw a triangle rotated in the direction of velocity
    let theta = this.velocity.heading() + PI / 2;

    stroke(200);
    strokeWeight(1);
    push();
    translate(this.position.x, this.position.y);
    rotate(theta);
    if (debug.checked()) {
      noFill();
      strokeWeight(3);
      stroke(0, 255, 0);
      line(0, 0, 0, -this.dna[0]*20)
      ellipse(0, 0, this.dna[2] * 2);
      strokeWeight(2);
      stroke(255, 0, 0)
      line(0, 0, 0, -this.dna[1]*20)
      ellipse(0, 0, this.dna[3] * 2);
    }
    
    let green = color(0, 255, 0);
    let red = color(255, 0, 0);
    let col = lerpColor(red, green, this.health);
    

    fill(col);
    stroke(col);
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);

    pop();
  }
}