class InstrumentGraphic {
  constructor(name, x, y, hitDistL, hitDistR, hitY, instrument, pitch) {
    this.sprite = name;
    this.x = x;
    this.y = y;
    this.hitDistL = hitDistL;
    this.hitDistR = hitDistR;
    this.hitY = hitY;
    this.instrument = instrument;
    this.pitch = pitch;
    this.animate = 0;
  }

  // renders the instrument
  render(graphicsManager) {
    
    // while the animate timer is above 0, switch it to the "hit" version of the sprite
    // and decrease the animate timer each frame so it quickly switches back to the default.
    if (this.animate > 0) {
      graphicsManager.drawSprite(this.sprite + "_pressed", this.x, this.y);
      this.animate--;
    } else {
      graphicsManager.drawSprite(this.sprite, this.x, this.y);
    }
  }

  
  // called when hit by a water drop
  hit() {
    this.animate = 5;
    this.instrument.playNote(this.pitch);
  }

  // search through the list of active droplets and
  // see if any are within collision bounds
  detectHit(droplets, createParticles) {
    let minX = this.x + this.hitDistL;
    let maxX = this.x + this.hitDistR;

    for (let i = 0; i < droplets.length; i++) {

      let d = droplets[i];
      let x = d.x;
      let y = d.y;
      if (x >= minX && x <= maxX) {
        if (y > this.y - this.hitY) {
          if (d.active) {
            this.hit(); // play the note and animate instrument
            createParticles(x,y); // create splash particles where the droplet was
            d.active = false; // mark the droplet for deletion
          }
        }
      }
    }
  }
}
