//board
let board;
const rowCount = 21;
const colCount = 19;
const tileSize = 32;
const boardWidth = rowCount * tileSize;
const boardHeight = colCount * tileSize;
let context;

// images
let blueGhost;
let orangeGhost;
let pinkGhost;
let redGhost;
let pacmanUp;
let pacmanDown;
let packmanLeft;
let packmanRight;
let wall;

window.onload = function() {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d"); // used for drawing on the board

  loadImages();
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