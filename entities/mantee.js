// entities/Mantee.js
export class Mantee {
    constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.dy = 0;
      this.gravity = 0.15; // Lower gravity for a gentle sink
      this.swimForce = -6;
    }
  
    applyGravity() {
      this.dy += this.gravity;
      this.y += this.dy;
    }
  
    swimUp() {
      this.dy = this.swimForce;
    }
  
    clampToScreen(H) {
      if (this.y < 0) {
        this.y = 0;
        this.dy = 0;
      }
      if (this.y + this.height > H) {
        this.y = H - this.height;
        this.dy = 0;
      }
    }
  
    draw(ctx, image) {
      ctx.drawImage(image, this.x, this.y, this.width, this.height);
    }
  }