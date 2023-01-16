/*
 * Universal class for handling the graphics assets in a sketch
 * Handles the creation and resizing of the canvas
 * Stores all image assets in an array that can be accessed without
 * needing to load them in twice.
 *
 * Only a single instance of this class should be created.
 */

class GraphicsManager {
  // creates a new canvas of width w, height h
  // adds all the sprites in the sketch to an array so they
  // only have to be loaded in once.
  constructor(w, h) {
    this.sprites = [];
    this.spriteNames = [];
    this.initializeSprites();

    this.SCREEN_SCALE = 0;
    this.IMAGE_SCALE = 5; // how far upscaled is the pixel art?
    this.w = w;
    this.h = h;
    this.CANVAS = createCanvas(w, h);
    this.setCanvas();
  }

  // adds all the sprites in the sketch
  initializeSprites() {
    this.addSprite("null");
    this.addSprite("pipes");
    this.addSprite("pipes_overlay");
    this.addSprite("drop");
    this.addSprite("particle_1");
    this.addSprite("particle_2");
    this.addSprite("kick");
    this.addSprite("kick_pressed");
    this.addSprite("hat");
    this.addSprite("hat_pressed");
    this.addSprite("snare");
    this.addSprite("snare_pressed");
    this.addSprite("cymbal");
    this.addSprite("cymbal_pressed");
    this.addSprite("key_white");
    this.addSprite("key_white_pressed");
    this.addSprite("key_black");
    this.addSprite("key_black_pressed");

    for (let i = 1; i <= 4; i++) {
      this.addSprite("faucet_green" + i);
    }
    for (let i = 1; i <= 4; i++) {
      this.addSprite("faucet_blue" + i);
    }
    for (let i = 1; i <= 4; i++) {
      this.addSprite("faucet_yellow" + i);
    }
    for (let i = 1; i <= 4; i++) {
      this.addSprite("faucet_purple" + i);
    }
    for (let i = 1; i <= 4; i++) {
      this.addSprite("faucet_red" + i);
    }
  }

  // adds a sprite to the list
  addSprite(path) {
    append(this.sprites, loadImage("assets/graphics/" + path + ".png"));
    append(this.spriteNames, path);
  }

  // returns a sprite from the list
  getSprite(path) {
    // search through spritenames for the index of the image name
    for (let i = 0; i < this.sprites.length; i++) {
      // if found, return the image located at that index
      if (this.spriteNames[i] == path) return this.sprites[i];
    }

    // otherwise return "null.png" and give an error
    console.log("[!] Image '" + path + "' could not be found!");
    return this.sprites[0];
  }

  // draws a sprite on the screen, correcting for the proper scaling
  drawSprite(spriteName,x, y) {
    let s = this.getSprite(spriteName);
    let sc = this.SCREEN_SCALE;
    image(
      s,
      round(x * sc),
      round(y * sc),
      round(s.width / this.IMAGE_SCALE * sc),
      round(s.height / this.IMAGE_SCALE * sc)
    );
  }

  // sets the canvas to the largest multiple of the base resolution
  // that fits inside the window
  setCanvas() {
    for (let i = 0; i < 6; i++) {
      if (this.w * i <= windowWidth && this.h * i <= windowHeight)
        this.SCREEN_SCALE = i;
    }
    resizeCanvas(this.w * this.SCREEN_SCALE, this.h * this.SCREEN_SCALE);

    // center the canvas in the window
    this.CANVAS.position(
      (windowWidth - width) / 2,
      (windowHeight - height) / 2
    );
  }
  
  // returns the mouse position in pixel coordinates (no matter the screen scale)
  getMouse(){
    return createVector(int( mouseX / this.SCREEN_SCALE), int( mouseY / this.SCREEN_SCALE));
  }
  
  // used for debugging
  debug(){
    noStroke();
    fill(255);
    let mx = mouseX / this.SCREEN_SCALE;
    mx = int(mx);
    let my = mouseY / this.SCREEN_SCALE;
    my = int(my);
    text(mx + ", " + my, 10,10);
    text("scale: " + this.SCREEN_SCALE, 10, 30);
  }
}
