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
  update();
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
  // move
  draw();
  setTimeout(update, 50);
  // setInterval, setTimeout, requestAnimationFrame
  // 20 FPS 1-> 1000ms /20 = 50
} 

function draw() {
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
  }
}