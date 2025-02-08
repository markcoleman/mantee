// utils.js
export function drawTiledCave(image, destX, destY, destW, destH, ctx) {
    const tileW = image.width;
    const tileH = image.height;
    if (!tileW || !tileH) return;
    for (let y = 0; y < destH; y += tileH) {
      for (let x = 0; x < destW; x += tileW) {
        const drawW = Math.min(tileW, destW - x);
        const drawH = Math.min(tileH, destH - y);
        ctx.drawImage(
          image,
          0, 0, drawW, drawH,
          destX + x, destY + y, drawW, drawH
        );
      }
    }
  }