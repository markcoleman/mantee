// entities/Heart.js
export class Heart {
    constructor(x, y, width = 32, height = 32) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }
  
    draw(ctx, cameraX, image) {
      const screenX = this.x - cameraX;
      ctx.drawImage(image, screenX, this.y, this.width, this.height);
    }
  
    checkCollision(mantee, cameraX) {
      const left = this.x;
      const right = this.x + this.width;
      const top = this.y;
      const bottom = this.y + this.height;
  
      // Mantee's world x-position is mantee.x + cameraX
      const mLeft = mantee.x + cameraX;
      const mRight = mLeft + mantee.width;
      const mTop = mantee.y;
      const mBottom = mantee.y + mantee.height;
  
      return !(mRight < left || mLeft > right || mBottom < top || mTop > bottom);
    }
  }