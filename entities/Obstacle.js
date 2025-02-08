// entities/Obstacle.js
export class Obstacle {
    constructor(type, rects) {
      this.type = type; // 'coral' or 'cave'
      this.rects = rects; // Array of rectangle objects: { x, y, width, height }
    }
  
    draw(ctx, cameraX, coralImage, caveImage, drawTiledCave) {
      for (let r of this.rects) {
        const screenX = r.x - cameraX;
        if (this.type === 'coral') {
          ctx.drawImage(
            coralImage,
            0, 0, coralImage.width, coralImage.height,
            screenX, r.y, r.width, r.height
          );
        } else {
          // For cave obstacles, tile the cave image.
          drawTiledCave(caveImage, screenX, r.y, r.width, r.height, ctx);
        }
      }
    }
  
    checkCollision(mantee, cameraX) {
      for (let r of this.rects) {
        const rectLeft = r.x - cameraX;
        const rectRight = rectLeft + r.width;
        const rectTop = r.y;
        const rectBottom = r.y + r.height;
  
        const mLeft = mantee.x;
        const mRight = mantee.x + mantee.width;
        const mTop = mantee.y;
        const mBottom = mantee.y + mantee.height;
  
        if (mRight > rectLeft &&
            mLeft < rectRight &&
            mBottom > rectTop &&
            mTop < rectBottom) {
          return true;
        }
      }
      return false;
    }
  }