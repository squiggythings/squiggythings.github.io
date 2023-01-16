class Faucet {
  constructor(color, x, y) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.isOn = true;
    this.anim = 0;
    this.sprites = [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3];
  }

  // draws the faucet
  render(gMan) {
    this.tick();
    let spriteName = "faucet_" + this.color + this.sprites[this.anim];
    gMan.drawSprite(spriteName, this.x, this.y);
  }

  // handles animation
  tick() {
    // set animation speed to be half the framerate
    if (frameCount % 2 == 0) {
      // if the faucet is on, slowly move to beginning of animation
      // if the faucet is off slowly move to the end of the animation
      this.anim += this.isOn ? -1 : 1;
      this.anim = constrain(this.anim, 0, this.sprites.length - 1);
    }
  }

  // checks if the mouse click was over the this faucet
  clickEvent(mx, my, sound) {
    if (dist(mx, my, this.x, this.y) < 6) {
      
      // if so, play the squeaky sound
      sound.stop();
      sound.rate(0.9);
      sound.play();
      
      // flip the faucet's state
      this.isOn = !this.isOn;
      
      // send a signal back to main.js to stop the mousePressed() function
      return true;
    }
    else
      return false;
  }
}
