/*
 * Project 2: A Clock That Is Not A Clock
 * "Goo"
 * 
 * Every current method of telling time involves some kind of visual sensation.
 * This project allows time to be told through a tactile "touch" experience.
 * 
 * The user is able to get a rough idea of what time it is only by
 * interacting with the blob. How solid it feels indicates how late in
 * the day it is, and the pitch of the sound upon interaction indicates
 * how far into the hour it is.
 * 
 * The sketch contains a slider that allows the user to jump forward up to
 * 24 hours. Since the blob's behavior changes over the course of the day 
 * the user would not be able to see how the blob behaves without having to
 * wait at different times. This option is purely for easier user experience.
 */

let x = []; // x position of each particle
let y = []; // y position of each particle
let sx = []; // x speed of each particle
let sy = []; // y speed of each particle
let ox = []; // x offset of each particle
let oy = []; // y offset of each particle
let s = []; // size of each particle
let n = 80; // number of particles
let sprites = [];

let msx = []; // mouse trail x
let msy = []; // mouse trail y

let BLOB_CLUMPINESS; // how solid the blob is vs how liquid


let slider; // the slider that allows the user to jump forward

function setup() {
  
  // create a canvas as big as the window
  createCanvas(windowWidth, windowHeight);
  
  // create the slider
  slider = createSlider(0, 2400, 0);
  slider.position(10, 10);
  slider.style('width', '240px');

  // set color mode to HSB
  colorMode(HSB);

  // create sound oscillators
  osc_square = new p5.SqrOsc();
  osc_sawtooth = new p5.SawOsc();
  osc_noise = new p5.Noise("pink");
  
  // start the sound oscillators
  osc_square.start();
  osc_sawtooth.start();
  osc_noise.start();
  
  // create n number of particles
  for (let i = 0; i < n; i++) {
    // each particle has a random position in the center of the canvas
    append(x, width / 2 + random(-100, 100));
    append(y, height / 2 + random(-100, 100));
    // an initial speed of 0
    append(sx, 0);
    append(sy, 0);
    
    
    // pick a random direction and amplitude and add that to the offset
    // this creates the clumpy natural shape of the goo
    let d = random(0, 2*PI);
    let a = random(0,60)
    append(ox, sin(d) * a);
    append(oy, cos(d) * a);
    
    // and a random size
    append(s, random(65, 100));
  }
}

function draw() {
  
  // create the mouse trail
  createMouseTrail();
  
  // set to the current time
  HOUR = hour();
  MINUTE = minute();
  SECOND = second();
  
  // add the slider value to the time
  HOUR += floor(slider.value() / 100);
  MINUTE += round(slider.value() % 100 / 1.66666667);
  SECOND += round(slider.value() % 100 / 2.77777779);
  
  // fix any overlapping
  HOUR %= 24;
  MINUTE %= 60;
  SECOND %= 60;

  // set the blob clumpiness according to the time of day
  BLOB_CLUMPINESS = HOUR + MINUTE / 60;
  
  speeds(); // calculate particle speeds
  positions(); // calculate particle positions
  render(); // render the particles
  
  // render the UI text
  noStroke(100);
  textAlign(CENTER);
  fill(100);
  textSize(12);
  text(slider.value() / 100 + " hours from now. ", 130, 42);
  textSize(15);
  text("Move the mouse over the blob.", width / 2, height - 20);
  
  // adjust the intensity of the sound based on the average speed of the blob
  let vol = findAvgSpeed();
  osc_square.amp(vol * 0.5 * (sin(millis()) / 20 + 0.5));
  osc_square.freq(vol * 350 + MINUTE * 1.75);
  osc_sawtooth.amp(vol * 0.75 * (cos(millis()) / 2 + 0.5));
  osc_sawtooth.freq(vol * 350 + 15 + MINUTE * 1.75);
  osc_noise.amp(vol * 0.5);
}

// keeps track of the last 8 mouse positions, used to draw the mouse trail
function createMouseTrail(){
  // add the mouse position to the end of the array
  append(msx, mouseX);
  append(msy, mouseY);
  
  // if length is greater than 8, remove the first element
  if (msx.length > 8)
    {
      msx.splice(0,1);
      msy.splice(0,1);
    }

}

// automatically resize the canvas
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// calculates the speeds of each particle
function speeds() {
  
  // declare temporary variables
  let _x,_y;
  let _sx, _sy;
  for (let i = 0; i < n; i++) {
    
    // reduce speed over time
    _sx = sx[i] * 0.92;
    _sy = sy[i] * 0.92;

    
    let seek_x = 0;
    let seek_y = 0;

    let _n = 0; // used to find average blob position
    
    // particle 'i' looks at all the other particles ('j') to calculate its speed
    for (let j = 0; j < n; j++) {
      // ignore comparing the same particle against itself
      if (true) {
        
        // calculate the position particle 'i' should move to
        seek_x += x[j];
        seek_y += y[j];
        _n++;
      }
    }

    // determine average by dividing sum by number of unique particle connections
    seek_x /= _n;
    seek_y /= _n;
    
    // find distance between average and current particle position
    _x = seek_x - x[i];
    _y = seek_y - y[i];
    let blob_dist = sqrt(_x * _x + _y * _y);

    // adjust the speed so the particle moves towards the center of the blob
    // and that it moves faster if it is further away    
    // factor in BLOB_CLUMPINESS to make the blob more liquid or solid
    _sx += _x / blob_dist * (BLOB_CLUMPINESS / 20 + 0.25);
    _sy += _y / blob_dist * (BLOB_CLUMPINESS / 20 + 0.25);
    
    // calculate distance from mouse cursor
    _x = x[i] + ox[i] - mouseX;
    _y = y[i] + oy[i] - mouseY;
    let mouseDist = sqrt(_x * _x + _y * _y);

    // if the mouse is touching the particle
    if (mouseDist < s[i] / 1.5) {
      // move the particle away from the mouse
      mouseDist = 3 / mouseDist;
      _sx += _x * mouseDist;
      _sy += _y * mouseDist;
    }

    // set the speed of the particle
    sx[i] = _sx;
    sy[i] = _sy;
  }
}

// calculates the position and edge-bouncing of each particle
function positions() {
  for (let i = 0; i < n; i++) {
    
    // change particle positions by their speeds
    x[i] += sx[i] * 2;
    y[i] += sy[i] * 2;

    // if the particle is on the edge, set their speed to move away from the edge
    if (x[i] < s[i] / 2) sx[i] = abs(sx[i]);
    if (x[i] > width - s[i] / 2) sx[i] = -abs(sx[i]);
    if (y[i] < s[i] / 2) sy[i] = abs(sy[i]);
    if (y[i] > height - s[i] / 2) sy[i] = -abs(sy[i]);
  }
}

// draws each layer of the blob
function render() {
  
  noCursor(); // hide the cursor
  
  background(11, 5) // dark background
  
  // set color to cycle through the hues over the course of an hour
  let goo_hue = map(MINUTE + SECOND / 60, 0,60,0,360);
  
  // shadow
  stroke(0);
  layer(25, 25, 4);
  
  // mouse shadow
  mousePoint(15,15,0);
  
  // outline
  stroke(goo_hue, 90, 112);
  layer(0, 0, 0);
  
  // mouse outline
  mousePoint(0,0,0);
  
  // inner layers
  stroke(goo_hue, 100, 52); // lighter, but darker than the outline
  layer(0, 0, 12);
  stroke(goo_hue, 100, 22); // darker than the fill
  layer(0, 0, 20);
  
  // fill
  stroke(goo_hue, 100, 32);
  layer(0, 0, 28);

  // mouse fill
  stroke(goo_hue, 100, 52); 
  mousePoint(0,0,15);
}

// draws a layer of the mouse trail
function mousePoint(offsetX, offsetY, size) {
  
  fill(0,0)
  beginShape();
  for(let i = msx.length; i > 0; i--){
    strokeWeight(20 - size + i * 3);
    line(msx[i] + offsetX, msy[i] + offsetY, msx[i - 1] + offsetX, msy[i - 1] + offsetY);
  }
  endShape();
}

// runs through the list of particle positions and draws a dot at those position
function layer(offsetX, offsetY, size) {
  for (let i = 0; i < n; i++) {
    strokeWeight(s[i] - size * 1.5);
    // use ox and oy to draw each point slightly offset from the center to create a clumpy shape
    point(x[i] + offsetX + ox[i], y[i] + offsetY + oy[i]);
  }
}

// returns a decimal between 0 and 1 that is proportional to the average
// velocity of each particle (basically how "messed up" the blob is)
function findAvgSpeed() {
  let sum = 0;
  
  for (let i = 0; i < n; i++) {
    // pythagorean theorem to find magnitude of
    // each particle's velocity
    sum += sqrt(sx[i] * sx[i] + sy[i] * sy[i]);
  }
  sum /= n; // divide the sum by n to find average
  
  // convert sum to a value between 0.01 and 1
  return constrain(map(sum - 1, 0, 18, 0, 1),0.01,1);
}