// game.js
import { Mantee } from './entities/Mantee.js';
import { Heart } from './entities/Heart.js';
import { Obstacle } from './entities/Obstacle.js';
import { drawTiledCave } from './utils.js';

// --- Canvas Setup ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;

// --- Asset Loading ---
const titleImage = new Image();
titleImage.src = 'title.png';

const backgroundImg = new Image();
backgroundImg.src = 'background.png';

const manteeImg = new Image();
manteeImg.src = 'mantee.png';

const heartImg = new Image();
heartImg.src = 'heart.png';

const coralImg = new Image();
coralImg.src = 'coral.png';

const caveImg = new Image();
caveImg.src = 'cave.png';

// Sound for heart collection
const heartSound = new Audio('heartCollect.mp3');
heartSound.volume = 0.8;

// --- Game Configuration ---
const worldWidth = 4000;
const goalX = 3800;
const scrollSpeed = 2;
let cameraX = 0;
let gameState = 'title';  // 'title', 'playing', 'win', 'gameover'
let roundNumber = 1;
let score = 0;
let highScore = 0;

// --- Create Player ---
const mantee = new Mantee(150, H / 2, 80, 48);

// --- Game Object Arrays ---
let obstacles = [];
let hearts = [];

// --- Input Event Listeners ---
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    if (gameState === 'title' || gameState === 'gameover') {
      startNewRound();
    } else if (gameState === 'playing') {
      mantee.swimUp();
    }
  }
});

canvas.addEventListener('mousedown', () => {
  if (gameState === 'playing') {
    mantee.swimUp();
  }
});

canvas.addEventListener('touchstart', () => {
  if (gameState === 'playing') {
    mantee.swimUp();
  }
});

// --- Main Game Loop ---
function gameLoop() {
  ctx.clearRect(0, 0, W, H);

  switch (gameState) {
    case 'title':
      drawTitleScreen();
      break;
    case 'playing':
      updateGame();
      drawGame();
      break;
    case 'win':
      drawGame();
      drawWinScreen();
      break;
    case 'gameover':
      drawGame();
      drawGameOverScreen();
      break;
  }

  requestAnimationFrame(gameLoop);
}

// --- Update Game State ---
function updateGame() {
  // Scroll the camera
  cameraX += scrollSpeed;

  // Update player physics
  mantee.applyGravity();
  mantee.clampToScreen(H);

  // Check collisions with obstacles
  for (let obs of obstacles) {
    if (obs.checkCollision(mantee, cameraX)) {
      gameOver();
      return;
    }
  }

  // Check collisions with hearts
  for (let i = 0; i < hearts.length; i++) {
    if (hearts[i].checkCollision(mantee, cameraX)) {
      hearts.splice(i, 1);
      i--;
      score++;
      if (score > highScore) highScore = score;
      heartSound.currentTime = 0;
      heartSound.play().catch(() => {});
    }
  }

  // Check if goal reached
  const manteeWorldX = cameraX + mantee.x + mantee.width / 2;
  if (manteeWorldX >= goalX) {
    gameState = 'win';
    setTimeout(() => {
      roundNumber++;
      startNewRound();
    }, 2000);
  }
}

// --- Drawing Functions ---
function drawGame() {
  drawScrollingBackground();
  drawObstacles();
  drawHearts();
  drawGoal();
  mantee.draw(ctx, manteeImg);
  drawProgressBar();
  drawScoreText();
}

function drawTitleScreen() {
  ctx.drawImage(titleImage, 0, 0, W, H);
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#fff';
  ctx.font = '40px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('MANTEE THE MANTA RAY', W / 2, H / 2 - 20);
  ctx.font = '30px "Courier New", monospace';
  ctx.fillText('Press SPACE to Start', W / 2, H / 2 + 30);
}

function drawScrollingBackground() {
  if (backgroundImg.complete) {
    const maxCameraX = Math.max(0, backgroundImg.width - W);
    const sourceX = Math.min(cameraX, maxCameraX);
    ctx.drawImage(backgroundImg, sourceX, 0, W, H, 0, 0, W, H);
  } else {
    ctx.fillStyle = '#003B73';
    ctx.fillRect(0, 0, W, H);
  }
}

function drawObstacles() {
  obstacles.forEach(obs => {
    obs.draw(ctx, cameraX, coralImg, caveImg, drawTiledCave);
  });
}

function drawHearts() {
  hearts.forEach(h => h.draw(ctx, cameraX, heartImg));
}

function drawGoal() {
  const lineX = goalX - cameraX;
  if (lineX > 0 && lineX < W) {
    ctx.save();
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(lineX, 0);
    ctx.lineTo(lineX, H);
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = '20px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GOAL', lineX + 10, H / 2);
    ctx.restore();
  }
}

function drawProgressBar() {
  const manteeWorldX = cameraX + mantee.x + mantee.width / 2;
  let progress = manteeWorldX / goalX;
  if (progress > 1) progress = 1;
  const barWidthMax = 200;
  const barHeight = 12;
  const barX = (W - barWidthMax) / 2;
  const barY = 5;
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.fillRect(barX, barY, barWidthMax, barHeight);
  ctx.fillStyle = '#00FF00';
  ctx.fillRect(barX, barY, barWidthMax * progress, barHeight);
  ctx.strokeStyle = '#000';
  ctx.strokeRect(barX, barY, barWidthMax, barHeight);
}

function drawScoreText() {
  ctx.save();
  ctx.fillStyle = '#fff';
  ctx.font = '40px "Courier New", monospace';
  ctx.textAlign = 'right';
  const textX = W - 10;
  const textY = 40;
  ctx.fillText(`ROUND: ${roundNumber}`, textX, textY);
  ctx.fillText(`SCORE: ${score}`, textX, textY + 40);
  ctx.fillText(`HIGH:  ${highScore}`, textX, textY + 80);
  ctx.restore();
}

function drawWinScreen() {
  ctx.fillStyle = 'rgba(0,255,0,0.3)';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#fff';
  ctx.font = '40px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('YOU WIN!', W / 2, H / 2);
}

function drawGameOverScreen() {
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#ff3333';
  ctx.font = '40px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('CRASHED INTO CORAL!', W / 2, H / 2 - 20);
  ctx.fillStyle = '#fff';
  ctx.font = '30px "Courier New", monospace';
  ctx.fillText('Press SPACE to Try Again...', W / 2, H / 2 + 30);
}

// --- World Generation Functions ---
function generateWorld() {
  const obstacleCount = 5 + Math.floor(Math.random() * 4);
  let newObstacles = [];
  for (let i = 0; i < obstacleCount; i++) {
    const obstacleX = 800 + i * 500 + Math.random() * 200;
    const obstacleType = Math.random() < 0.5 ? 'coral' : 'cave';
    if (obstacleType === 'coral') {
      const obsHeight = 50 + Math.random() * 150;
      const rects = [{
        x: obstacleX,
        y: H - obsHeight,
        width: 80,
        height: obsHeight
      }];
      newObstacles.push(new Obstacle('coral', rects));
    } else {
      const gapSize = 100 + Math.random() * 80;
      const topHeight = 50 + Math.random() * 120;
      const bottomHeight = H - (topHeight + gapSize);
      const rects = [
        { x: obstacleX, y: 0, width: 80, height: topHeight },
        { x: obstacleX, y: H - bottomHeight, width: 80, height: bottomHeight }
      ];
      newObstacles.push(new Obstacle('cave', rects));
    }
  }
  return newObstacles;
}

function generateHearts() {
  const heartCount = 5 + Math.floor(Math.random() * 4);
  let newHearts = [];
  for (let i = 0; i < heartCount; i++) {
    const hx = 300 + Math.random() * (worldWidth - 600);
    const hy = Math.random() * (H - 32);
    newHearts.push(new Heart(hx, hy));
  }
  return newHearts;
}

function startNewRound() {
  cameraX = 0;
  mantee.y = H / 2;
  mantee.dy = 0;
  obstacles = generateWorld();
  hearts = generateHearts();
  if (gameState === 'gameover') {
    score = 0;
  }
  gameState = 'playing';
}

function gameOver() {
  if (score > highScore) {
    highScore = score;
  }
  gameState = 'gameover';
}

// --- Start the Game Loop ---
requestAnimationFrame(gameLoop);