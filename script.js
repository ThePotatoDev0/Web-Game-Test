const player = document.getElementById('player');
const platforms = document.querySelectorAll('.platform');
const gameWorld = document.getElementById('game-world');
const gameContainer = document.getElementById('game-container');

let playerX = 50; // Player's X position
let playerY = 260; // Player's Y position
let velocityX = 0; // Horizontal velocity
let velocityY = 0; // Vertical velocity
let isJumping = false;

let scrollOffset = 0; // Tracks the scrolling position

// Key press event listeners
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') velocityX = 5;
  if (e.key === 'ArrowLeft') velocityX = -5;
  if (e.key === 'ArrowUp' && !isJumping) {
    velocityY = -12;
    isJumping = true;
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') velocityX = 0;
});

// Game loop
function gameLoop() {
  // Apply gravity
  velocityY += 0.5;

  // Move player
  playerX += velocityX;
  playerY += velocityY;

  // Prevent going out of bounds vertically
  if (playerY + player.offsetHeight > gameContainer.offsetHeight) {
    playerY = gameContainer.offsetHeight - player.offsetHeight;
    velocityY = 0;
    isJumping = false;
  }

  // Horizontal boundaries (player stays in the middle of the viewport)
  if (playerX > gameContainer.offsetWidth / 2 && velocityX > 0) {
    scrollOffset -= velocityX; // Move the world left
    if (scrollOffset + gameContainer.offsetWidth >= gameWorld.offsetWidth) {
      scrollOffset = gameWorld.offsetWidth - gameContainer.offsetWidth;
    }
  } else if (playerX < gameContainer.offsetWidth / 2 && velocityX < 0) {
    scrollOffset -= velocityX; // Move the world right
    if (scrollOffset < 0) scrollOffset = 0;
  } else {
    // Allow the player to move freely within the non-scrolling region
    playerX += velocityX;
  }

  // Check for platform collision
  platforms.forEach((platform) => {
    const platformRect = platform.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (
      playerRect.right > platformRect.left &&
      playerRect.left < platformRect.right &&
      playerRect.bottom > platformRect.top &&
      playerRect.bottom < platformRect.top + 10 &&
      velocityY > 0
    ) {
      velocityY = 0;
      playerY = platform.offsetTop - player.offsetHeight;
      isJumping = false;
    }
  });

  // Update world position
  gameWorld.style.transform = `translateX(${scrollOffset}px)`;

  // Update player's position
  player.style.left = `${playerX}px`;
  player.style.top = `${playerY}px`;

  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
