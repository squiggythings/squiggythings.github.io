/*
 * "Water Pipes"
 * Elias Ananiadis
 *
 * Inspired by Animusic and Wintergatan's marble machine, the pipes will drip water
 * onto the instruments to play a song: ("Yakan Kouro" by fox capture plan, which is
 * itself an arrangement of Jamiroquai's "Virtual Insanity")
 *
 * Turn the faucets on and off by clicking the colored handles.
 *   Purple = bass
 *   Green = electric piano
 *   Red = snare drum
 *   Blue = kick drum
 *   Yellow = hi hat + ride cymbal
 *
 * You can also click anywhere on the screen to create a water droplet that can fall
 * onto the instruments and play them.
 * Silence an instrument and then click above it to play along for yourself.
 * 
 * All graphics drawn in Aseprite
 * 
 * Arrangement of "Yakan Kouro" done in Famitracker 0CC and then imported the stems as
 * .txt files into the project. A separate p5js sketch was created to read the 
 * Famitracker file and convert it into the .txt format that is used in this sketch.
 *
 */


// instrument objects
let bass;
let keys;
let drumKick;
let drumSnare;
let drumHat;
let drumCymbal;

// single instance management classes
let graphicsManager;
let tempoManager;

// timing variables
let step = 0;
let millisecondTimer = 100;
let realMilliseconds = 0;

// faucet objects
let faucets = [];
let faucetSound;

// holds the sequences for each instrument
let bassPart = [];
let keysPart = [];
let drumSnarePart = [];
let drumHatPart = [];
let drumKickPart = [];
let drumCymbalPart = [];

// holds the physical sprites/triggers for each instrument
let snareSprite;
let hatSprite;
let kickSprite;
let cymbalSprite;
let bassSprites = []; // use array to store the keyboard instruments
let keysSprites = []; 

// holds the particles
let waterDrops = [];
let waterParticles = [];

// order of black/white keys
let KEYBOARD_REFERENCE = [
  "white", // F
  "black", // F#
  "white", // G
  "black", // G#
  "white", // A
  "black", // A#
  "white", // B
  "white", // C
  "black", // C#
  "white", // D
  "black", // D#
  "white", // E
  "white", // F
  "black", // F#
  "white", // G
];

function preload() {
  graphicsManager = new GraphicsManager(360, 200);
  tempoManager = new TempoManager(92, 6);
  soundFormats("ogg");
  
  // instantiate instrument voices
  bass = new Instrument(loadSound("assets/sounds/bass.ogg"), true);
  keys = new Instrument(loadSound("assets/sounds/keys_short.ogg"), false);
  drumSnare = new Instrument(loadSound("assets/sounds/snare.ogg"), true);
  drumHat = new Instrument(loadSound("assets/sounds/hi_hat.ogg"), true);
  drumKick = new Instrument(loadSound("assets/sounds/kick.ogg"), true);
  drumCymbal = new Instrument(loadSound("assets/sounds/cymbal.ogg"), true);
  
  faucetSound = loadSound("assets/sounds/faucet.ogg");

  bassPart = loadStrings("assets/instrument data/bass.txt");
  hatPart = loadStrings("assets/instrument data/hat.txt");
  snarePart = loadStrings("assets/instrument data/snare.txt");
  kickPart = loadStrings("assets/instrument data/kick.txt");
  cymbalPart = loadStrings("assets/instrument data/cymbal.txt");
  keysPart = loadStrings("assets/instrument data/keys.txt");
}

function setup() {
  imageMode(CENTER);

  // resize/scale the canvas
  graphicsManager.setCanvas();

  // mixing
  bass.setVolumePan(0.9, 0);
  keys.setVolumePan(0.2, 0);
  drumSnare.setVolumePan(0.5, -0.1);
  drumKick.setVolumePan(0.5, 0.1);
  drumHat.setVolumePan(0.2, -0.4);
  drumCymbal.setVolumePan(0.33, 0.4);

  // instantiate sprite/trigger objects
  snareSprite = new InstrumentGraphic(
    "snare",
    168,
    187,
    -6,
    6,
    7,
    drumSnare,
    0
  );
  hatSprite = new InstrumentGraphic("hat", 155, 178, -8, 6, 10, drumHat, 0);
  kickSprite = new InstrumentGraphic("kick", 181, 179, -6, 11, 7, drumKick, 0);
  cymbalSprite = new InstrumentGraphic(
    "cymbal",
    202,
    177,
    -10,
    12,
    14,
    drumCymbal,
    0
  );

  faucets[0] = new Faucet("purple", 147, 28); // bass
  faucets[1] = new Faucet("red", 167, 46); // snare
  faucets[2] = new Faucet("blue", 176, 22); // kick
  faucets[3] = new Faucet("yellow", 187, 8); // cymbals
  faucets[4] = new Faucet("green", 214, 30); // keys

  
  // create the keyboards
  let x = 17;
  for (let i = 0; i < 15; i++) {
    // outputs either 'key_black' or 'key_white' depending on the order defined in KEYBOARD_REFERENCE
    let t = "key_" + KEYBOARD_REFERENCE[i];
    
    //
    bassSprites[i] = new InstrumentGraphic(t, x, 181, -3, 4, 11, bass, i - 4);
    keysSprites[i] = new InstrumentGraphic(
      t,
      x + 215,
      181,
      -3,
      4,
      11,
      keys,
      i - 4
    );
    x += 8;
  }
}

// update canvas when the window is changed
function windowResized() {
  graphicsManager.setCanvas();
}

function draw() {
  
  // draw the background
  background(26, 25, 50);

  // render pipes background
  graphicsManager.drawSprite("pipes", 180, 100);

  // render instrument sprites
  kickSprite.render(graphicsManager);
  snareSprite.render(graphicsManager);
  hatSprite.render(graphicsManager);
  cymbalSprite.render(graphicsManager);
  for (let i = 0; i < 15; i++) {
    bassSprites[i].render(graphicsManager);
    keysSprites[i].render(graphicsManager);
  }

  // waterdrops
  for (let i = 0; i < waterDrops.length; i++) {
    // delete any inactive water drops
    if (waterDrops[i].active == 0) {
      waterDrops.splice(i, 1);
      i--;
    } else {
      // otherwise display them (and continue their physics)
      waterDrops[i].render(graphicsManager);
    }
  }

  // render water particles
  for (let i = 0; i < waterParticles.length; i++) {
    
    // remove any particles that are off-screen
    if (waterParticles[i].y > 205) {
      waterParticles.splice(i, 1);
      i--;
    } else {
      // otherwise display them (and continue their physics)
      waterParticles[i].render(graphicsManager);
    }
  }

  // render pipe overlay
  // this gives the illusion of the droplets actually
  // coming out of the pipe, not just appearing at the
  // end of the opening.
  graphicsManager.drawSprite("pipes_overlay", 180, 100);

  // render faucets
  for (let i = 0; i < 5; i++) {
    faucets[i].render(graphicsManager);
  }

  // each instrument sprite runs through the list of water droplets
  // and checks if any of them are hit
  kickSprite.detectHit(waterDrops, createParticles);
  snareSprite.detectHit(waterDrops, createParticles);
  hatSprite.detectHit(waterDrops, createParticles);
  cymbalSprite.detectHit(waterDrops, createParticles);
  for (let i = 0; i < 15; i++) { // run through each key of the keyboards
    bassSprites[i].detectHit(waterDrops, createParticles);
    keysSprites[i].detectHit(waterDrops, createParticles);
  }

  // using a separate variable instead of built in millis() so that if 
  // the user switches focus of the window, the song will leave right back
  // left off. (millis() continues)
  realMilliseconds += 16.66667; // milliseconds per frame (framerate is 60 fps)
  
  // this code executes a 'step', 1/6 of a beat
  // and happens 
  if (realMilliseconds > millisecondTimer) {
    millisecondTimer += tempoManager.getMilliseconds();
    if (faucets[0].isOn) playInst(bassPart, 49, 49, false);
    if (faucets[3].isOn) playInst(hatPart, 155, 46, false);
    if (faucets[1].isOn) playInst(snarePart, 167, 58, false);
    if (faucets[2].isOn) playInst(kickPart, 181, 50, false);
    if (faucets[3].isOn) playInst(cymbalPart, 200, 44, false);
    if (faucets[4].isOn) playInst(keysPart, 256, 49, true);
    step++;
  }
}

// check if the current step has a note in the instrument
// if so play the note (or notes in the case of the keys)
function playInst(part, spawnX, spawnY, isPolyphonic) {
  if (isPolyphonic) {
    
    // different code for the keys since it has multiple notes playing
    // at the same time
    let t = part[step % part.length];
    if (t != "-") {
      // check each row of keys.txt to grab all the notes in the chord
      for (let i = 0; i <= t.length; i += 3) {
        let note = int(t.substring(i, i + 3)) + 1;
        // prevents NaN errors
        if (note < 15)
          // create a water drop at the opening of the pipe
          append(waterDrops, new WaterDrop(spawnX + note * 8, spawnY));
      }
    }
  } else if (part[step % part.length] != "-") {
    // if there is a note at the step position, create it at the opening of the pipe
    let note = int(part[step % part.length]);
    append(waterDrops, new WaterDrop(spawnX + note * 8, spawnY));
  }
}

// handles what happens when the user clicks
function mousePressed() {
  // store mouse position in pixel units inside a vector
  // (this ignores whatever the screen scaling might be)
  let mouse = graphicsManager.getMouse();

  // check if any of the faucets were clicked
  for (let i = 0; i < 5; i++) {
    if (faucets[i].clickEvent(mouse.x, mouse.y, faucetSound)) return null; // if so stop the method
  }

  // otherwise this means the user clicked elsewhere

  // check if mouse was on canvas
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouse.y < 190) {
    // if so, create a drop at the mouse
    append(waterDrops, new WaterDrop(mouse.x, mouse.y));
  }
}

// creates NUM_PARTICLES amount of splash particles at (x,y)
function createParticles(x, y) {
  let NUM_PARTICLES = 9;
  for (let i = 0; i < NUM_PARTICLES; i++) {
    append(waterParticles, new Particle(x, y));
  }
}
