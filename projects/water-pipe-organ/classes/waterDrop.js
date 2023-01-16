class WaterDrop{
  
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.yvel = 0;
    this.active = 1; // mark as 0 if the particle should be killed
  }
  
  // physics calculations
  tick(){
    let GRAVITY = 0.15; // constant
    this.yvel += GRAVITY;
    this.y += this.yvel;
    if (this.y > height)
      this.active = 0;
  }
  
  // render the droplet
  render(graphicsManager){
    this.tick();
    graphicsManager.drawSprite("drop", this.x,this.y);
  }
}