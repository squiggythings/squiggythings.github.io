// water splash particles
class Particle{
  
  constructor(x,y){
    this.x = x;
    this.y = y;
    
    // randomize splash direction
    this.xv = random(-1,1);
    this.yv = random(-0.5,-2);
    
    // randomize sprite
    this.sprite = random(1) < 0.5? "particle_1" : "particle_2";
  }
  
  // render the particle
  render(graphicsManager){
    graphicsManager.drawSprite(this.sprite, this.x,this.y);
    this.x += this.xv;
    this.y += this.yv;
    this.yv += 0.1;
  }
}