//board
let board;
const rowCount = 21;
const colCount = 19;
const tileSize = 32;
const boardWidth = colCount * tileSize;
const boardHeight = rowCount * tileSize;
let context;

// images
let blueGhost;
let orangeGhost;
let pinkGhost;
let redGhost;
let pacmanUp;
let pacmanDown;
let pacmanLeft;
let pacmanRight;
let wallImage;

//X = wall, O = skip, P = pac man, ' ' = food
//Ghosts: b = blue, o = orange, p = pink, r = red
const tileMap = [
    "XXXXXXXXXXXXXXXXXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X                 X",
    "X XX X XXXXX X XX X",
    "X    X       X    X",
    "XXXX XXXX XXXX XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXrXX X XXXX",
    "O       bpo       O",
    "XXXX X XXXXX X XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXXXX X XXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X  X     P     X  X",
    "XX X X XXXXX X X XX",
    "X    X   X   X    X",
    "X XXXXXX X XXXXXX X",
    "X                 X",
    "XXXXXXXXXXXXXXXXXXX" 
];

const walls = new Set();
const foods = new Set();
const ghosts = new Set();
let pacman;

// up down left right
const directions = ['U', 'D', 'L', 'R'];
let score = 0;
let lives = 3;
let gameOver = false;

window.onload = function() {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d"); // used for drawing on the board

  loadImages();
  loadMap();
  // console.log(walls.size);
  // console.log(foods.size);
  // console.log(ghosts.size);

  for (let ghost of ghosts.values()) {
    const newDirection = directions[Math.floor(Math.random()*4)]; // 0-3
    ghost.updateDirection(newDirection);
  }

  update();

  document.addEventListener("keyup", movePacman);
}

function loadImages() {
  wallImage = new Image();
  wallImage.src = "./images/wall.png";

  blueGhost = new Image();
  blueGhost.src = "./images/blueGhost.png";
  orangeGhost = new Image();
  orangeGhost.src = "./images/orangeGhost.png";
  redGhost = new Image();
  redGhost.src = "./images/redGhost.png";
  pinkGhost = new Image();
  pinkGhost.src = "./images/pinkGhost.png";

  pacmanDown = new Image();
  pacmanDown.src = "./images/pacmanDown.png";
  pacmanUp = new Image();
  pacmanUp.src = "./images/pacmanUp.png";
  pacmanLeft = new Image();
  pacmanLeft.src = "./images/pacmanLeft.png";
  pacmanRight = new Image();
  pacmanRight.src = "./images/pacmanRight.png";

}

function loadMap() {
  walls.clear();
  foods.clear();
  ghosts.clear();

  for (let r = 0; r < rowCount; r++) {
    for (let c = 0; c < colCount; c++) {
      const row = tileMap[r];
      const tileMapChar = row[c];

      const x = c * tileSize;
      const y = r * tileSize

      if (tileMapChar == 'X') { //block wall 
        const wall = new Block(wallImage, x, y, tileSize, tileSize);
        walls.add(wall);
      } 
      else if (tileMapChar == 'b') { // blue ghost
        const ghost = new Block(blueGhost, x, y, tileSize, tileSize);
        ghosts.add(ghost);
      }
      else if (tileMapChar == 'p') { // pink ghost
        const ghost = new Block(pinkGhost, x, y, tileSize, tileSize);
        ghosts.add(ghost);
      }
      else if (tileMapChar == 'o') { // orange ghost
        const ghost = new Block(orangeGhost, x, y, tileSize, tileSize);
        ghosts.add(ghost);
      }
      else if (tileMapChar == 'r') { // red ghost
        const ghost = new Block(redGhost, x, y, tileSize, tileSize);
        ghosts.add(ghost);
      }
      else if (tileMapChar == 'P') { // pacman
        pacman = new Block(pacmanRight, x, y, tileSize, tileSize);
      }
      else if (tileMapChar == ' ') { // empty is food
        const food = new Block(null, x+14, y+14, 4, 4);
        foods.add(food);
      }
    }
  }
}

function update() {
  if (gameOver) {
    return;
  }
  move();
  draw();
  setTimeout(update, 50);
  // setInterval, setTimeout, requestAnimationFrame
  // 20 FPS 1-> 1000ms /20 = 50
} 

function draw() {
  context.clearRect(0,0,board.width, board.height);
  context.drawImage(pacman.image, pacman.x, pacman.y, pacman.width, pacman.height);

  for (let ghost of ghosts.values()) {
    context.drawImage(ghost.image, ghost.x, ghost.y, ghost.width, ghost.height);
  }

  for (let wall of walls.values()) {
    context.drawImage(wall.image, wall.x, wall.y, wall.width, wall.height);
  }

  context.fillStyle = "white";
  for (let food of foods.values()) {
    context.fillRect(food.x, food.y, food.width, food.height);
  }

  // score
  context.fillStyle = "white";
  context.font = "14px sans-serif";
  if (gameOver) {
    context.fillText("Game Over: " + String(score), tileSize/2, tileSize/2);
  }
  else {
    context.fillText("x" + String(lives) + " " + String(score), tileSize/2, tileSize/2);
  }
}

function move() {
  pacman.x += pacman.velocityX;
  pacman.y += pacman.velocityY;

  // check wall collisions
  for (let wall of walls.values()) {
    if (collision(pacman, wall)) {
      pacman.x -= pacman.velocityX;
      pacman.y -= pacman.velocityY;
      break;
    }
  }

  for (let ghost of ghosts.values()) {
    if (collision(ghost, pacman)) {
      lives -= 1;
      if (lives == 0) {
        gameOver = true;
        return;
      }
      resetPositions();
    }

    if (ghost.y == tileSize*9 && ghost.direction != 'U' && ghost.direction != 'D') {
      ghost.updateDirection('U');
    }

    ghost.x += ghost.velocityX;
    ghost.y += ghost.velocityY;

    for (let wall of walls.values()) {
      if (collision(ghost, wall) || ghost.x <= 0 || ghost.x + ghost.width >= boardWidth) {
        ghost.x -= ghost.velocityX;
        ghost.y -= ghost.velocityY;
        const newDirection = directions[Math.floor(Math.random()*4)]; // 0-3
        ghost.updateDirection(newDirection);
      }
    }
  }

  // food collision
  let foodEaten = null;
  for (let food of foods.values()) {
    if (collision (pacman, food)) {
      foodEaten = food;
      score += 10;
      break;
    }
  }
  foods.delete(foodEaten);

  // next level
  if (foods.size == 0) {
    loadMap();
    resetPositions();
  }
}

function movePacman(e) {
  if (gameOver){
    loadMap();
    resetPositions();
    lives = 3;
    score = 0;
    gameOver = false;
    update(); // restart the game
    return;
  }

  if (e.code == "ArrowUp" || e.code == "KeyW") {
    pacman.updateDirection('U');
  }
  else if (e.code == "ArrowDown" || e.code == "KeyS") {
    pacman.updateDirection('D');
  }
  else if (e.code == "ArrowLeft" || e.code == "KeyA") {
    pacman.updateDirection('L');
  }
  else if (e.code == "ArrowRight" || e.code == "KeyD") {
    pacman.updateDirection('R');
  }

  // update pacman images
  if (pacman.direction == 'U') {
    pacman.image = pacmanUp;
  }
  else if (pacman.direction == 'D') {
    pacman.image = pacmanDown;
  }
  else if (pacman.direction == 'L') {
    pacman.image = pacmanLeft;
  }
  else if (pacman.direction == 'R') {
    pacman.image = pacmanRight;
  }
}

function collision(a,b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

function resetPositions() {
  pacman.reset();
  pacman.velocityX = 0;
  pacman.velocityY = 0;

  for (let ghost of ghosts.values()) {
    ghost.reset();
    const newDirection = directions[Math.floor(Math.random()*4)]; // 0-3
    ghost.updateDirection(newDirection);
  }
}

class Block{
  constructor(image, x, y, width, height) {
    this.image = image;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.startX = x;
    this.startY = y;

    this.direction = 'R';
    this.velocityX = 0;
    this.velocityY = 0;
  }

  updateDirection(direction) {
    const prevDirection = this.direction;
    this.direction = direction;
    this.updateVelocity();
    this.x += this.velocityX;
    this.y += this.velocityY;

    for (let wall of walls.values()) {
      if (collision(this, wall)) {
        this.x -= this.velocityX;
        this.y -= this.velocityY;
        this.direction = prevDirection;
        this.updateVelocity();
        return;
      }
    }
  }

  updateVelocity() {
    if (this.direction == 'U') {
      this.velocityX = 0;
      this.velocityY = -tileSize/4;
    }
    else if (this.direction == 'D') {
      this.velocityX = 0;
      this.velocityY = tileSize/4;
    }
    else if (this.direction == 'L') {
      this.velocityX = -tileSize/4;
      this.velocityY = 0;
    }
    else if (this.direction == 'R') {
      this.velocityX = tileSize/4;
      this.velocityY = 0;
    }
  }

  reset() {
    this.x = this.startX;
    this.y = this.startY;
  }
}