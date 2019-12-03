var emptyTile;
var curImage;
var curSize;
var isPlaying = false;
var moveCount = 0;
var startingGrid;
const DEFAULT_STYLING = ["black", "black", "none"];
const HIGHLIGHT_STYLING = ["red", "#006600", "underline"];



function GameStart(image, size) {
  clearBoard();
  BuildBoard(image, size);
  var shuffle = document.getElementById('ShuffleButton');
  shuffle.setAttribute("onclick", "shuffle();");
  var reset = document.getElementById("ResetButton");
  reset.setAttribute("onclick", "resetBoard();");
  var audioplay = document.getElementById("playAudio");
  audioplay.setAttribute("onclick", "handleAudio(this);");
  moveCount = 0;
  var moveC = document.getElementById("MoveCount");
  moveC.textContent = "Move Count: " + moveCount;


}

function BuildBoard(backgroundPhoto, size) {
  var GameGrid = document.getElementById("GameGrid");
  var count = 1;
  var offsetX = 0;
  var offsetY = 0;
  var offsetDifference =  Math.fround(400 / size);
  emptyTile = "Tile:" + size + "|" + size;

  for (i = 1; i <= size; i++) {
    var curRow = "Row_" + i;
    var tblRow = document.createElement("tr");
    tblRow.id = curRow;

    for (k = 1; k <= size; k++) {
      let curSquare = document.createElement("td");
      curSquare.id = "Tile:" + i + "|" + k;
      let curElement = document.createElement("div");
      curElement.className = "Tile";
      curElement.textContent = count;
      count++;
      curSquare.style.border = "2px black solid";
      curSquare.style.padding = "0px";
      curElement.style.backgroundImage = "url(" + backgroundPhoto + ")";
      curElement.style.backgroundPosition = -offsetX + "px " + -offsetY + "px";
      curElement.style.height = offsetDifference - 4;
      curElement.style.width = offsetDifference - 4;

      curSquare.appendChild(curElement);
      tblRow.appendChild(curSquare);
      offsetX = offsetX + offsetDifference;
    }
    GameGrid.appendChild(tblRow);
    offsetY = offsetY + offsetDifference;
  }
  let blankTile = document.getElementById("Tile:" + size + "|" + size);
  let btContent = blankTile.firstElementChild;
  btContent.style.backgroundImage = "none";
  btContent.textContent = "";

  let Tiles = document.getElementsByClassName("Tile");
  for (let x of Tiles) {
    let curTd = x.parentElement;
    curTd.setAttribute("onclick", "tileClickHandler(this);");
    curTd.setAttribute("onmouseenter", "highlightAdjacent(this, true, true);");
    curTd.setAttribute("onmouseleave", "highlightAdjacent(this, false, true);");

  }
  startingGrid = GameGrid;

}

function highlightAdjacent(Square, isEntering, OnMouseCall) {
  if (isAdjacent(Square) && OnMouseCall) {
    if (isEntering) {
      Square.style.borderColor = HIGHLIGHT_STYLING[0];
      Square.style.color = HIGHLIGHT_STYLING[1];
      Square.style.textDecoration = HIGHLIGHT_STYLING[2];
    } else if (!isEntering) {
      Square.style.borderColor = DEFAULT_STYLING[0];
      Square.style.color = DEFAULT_STYLING[1];
      Square.style.textDecoration = DEFAULT_STYLING[2];
    }
  }
  if (!OnMouseCall) {
    Square.style.borderColor = DEFAULT_STYLING[0];
    Square.style.color = DEFAULT_STYLING[1];
    Square.style.textDecoration = DEFAULT_STYLING[2];
  }
}

function tileClickHandler(Square) {
  if (isAdjacent(Square) == true) {
    MoveTile(Square);
    moveCount++;
    var moveC = document.getElementById("MoveCount");
    moveC.textContent = "Move Count:" + moveCount;
  }

}

function isAdjacent(current) {

  let curX = parseInt(current.id.split(":")[1].split("|")[0]);
  let curY = parseInt(current.id.split(":")[1].split("|")[1]);
  let emptyX = parseInt(emptyTile.split(":")[1].split("|")[0]);
  let emptyY = parseInt(emptyTile.split(":")[1].split("|")[1]);
  var isNextTo = false;

  if (((curY == emptyY + 1) && (curX == emptyX)) || ((curY == emptyY - 1) && (curX == emptyX)) ||
    ((curY == emptyY) && (curX == emptyX + 1)) || ((curY == emptyY) && (curX == emptyX - 1)))
    isNextTo = true;


  return isNextTo;
}

function MoveTile(Square) {
  let curID = Square.id;
  let curElement = Square.firstElementChild.cloneNode(true);
  let curEmptySquare = document.getElementById(emptyTile);
  let curEmpty = curEmptySquare.firstElementChild.cloneNode(true);

  Square.replaceChild(curEmpty, Square.firstElementChild);
  curEmptySquare.replaceChild(curElement, curEmptySquare.firstElementChild);
  emptyTile = curID;
  highlightAdjacent(Square, false, false);
}

function shuffle() {
  var altBool = false;
  var current = null;
  var range;

  for (let x = 0; x < 300; x++) {
    let emptyX = parseInt(emptyTile.split(":")[1].split("|")[0]);
    let emptyY = parseInt(emptyTile.split(":")[1].split("|")[1]);

    do {
      range = Math.floor(Math.random() * 3) + (-1);
      if (altBool) {
        current = document.getElementById("Tile:" + (emptyX + range) + "|" + emptyY);
      } else {
        current = document.getElementById("Tile:" + emptyX + "|" + (emptyY + range));
      }
    }
    while (current === null);

    if (current !== null && isAdjacent(current)) {
      MoveTile(current);
    }
    altBool = !altBool;
  }
}

function clearBoard() {

  let gameGrid = document.getElementById("GameGrid");
  let Tiles = gameGrid.getElementsByTagName("tr");

  for (let x = Tiles.length - 1; x >= 0; x--) {
    let curElement = Tiles[x];
    gameGrid.removeChild(curElement);
  }

}

function resetBoard() {
  clearBoard();
  BuildBoard(curImage, curSize);
}

function selectImage(selectedImage) {
  let thisImage = selectedImage.value;
  curImage = thisImage;
}

function selectSize(selectedSize) {
  let thisSize = selectedSize.value;
  curSize = thisSize;
}

function handleAudio(Audio) {
  var audio = document.getElementById('testAudio');
  if (isPlaying) {
    Audio.textContent = "Music ON";
    audio.pause();
    isPlaying = !isPlaying;

  } else {
    Audio.textContent = "Music OFF";
    audio.play();
    isPlaying = !isPlaying;
  }
}

function loadSettings(){
  curImage =  document.getElementById("images").value;
  curSize = document.getElementById("sizes").value;
  GameStart(curImage, curSize); 
}