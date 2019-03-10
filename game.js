/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/


let canvas;
let ctx;
let controlScreen = true;
let startedAt;
let level = 'green';
let currentRecord = 0;
let newRecord = 0;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

let startBtn = {
  x: 0,
  y: 0,
  width: 0,
  height: 0
}

let seconds = 0;
let welMess_x, welMess_y; const welMess_len = 200;
let START_x, START_y, START_len;
let bgReady, heroReady, monsterReady, mushroomReady;
let bgImage, heroImage, monsterImage, mushroomImage;
let message = "Welcome to Pixel Game";
let strInBtn = "START";

function loadImages() {
  bgImage = new Image();
  bgImage.onload = function () {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "images/background.png";
  heroImage = new Image();
  heroImage.onload = function () {
    // show the hero image
    heroReady = true;
  };
  heroImage.src = "images/green-left.png";

  monsterImage = new Image();
  monsterImage.onload = function () {
    // show the monster image
    monsterReady = true;
  };
  monsterImage.src = "images/monster0.png";

  mushroomImage = new Image();
  mushroomImage.onload = function () {
    // show the mushroom image
    mushroomReady = false;
  };
  mushroomImage.src = "images/mushroom.png";
}

function countUpTimer() {

  var now = new Date().getTime();
  var distance = now - startedAt;
  seconds = Math.floor((distance / 100))/10;

}
/** 
 * Setting up our characters.
 * 
 * Note that heroX represents the X position of our hero.
 * heroY represents the Y position.
 * We'll need these values to know where to "draw" the hero.
 * 
 * The same applies to the monster.
 */

let heroX = canvas.width / 2;
let heroY = canvas.height / 2;

let monsterX = 100;
let monsterY = 100;

const mushroomX = Math.random() * (canvas.width - 150);
const mushroomY = Math.random() * (canvas.height - 150);
let score = 0;
/** 
 * Keyboard Listeners
 * You can safely ignore this part, for now. 
 * 
 * This is just to let JavaScript know when the user has pressed a key.
*/
let keysDown = {};
function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here. 
  addEventListener("keydown", function (key) {
    keysDown[key.keyCode] = true;
  }, false);

  addEventListener("keyup", function (key) {
    delete keysDown[key.keyCode];
  }, false);
}


/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the monster has been caught!
 *  
 *  If you change the value of 5, the player will move at a different rate.
 */
let update = function () {
  countUpTimer();
  if (38 in keysDown) { // Player is holding up key
    if ((heroY - 5) >= 10 && (heroY - 5) <= canvas.height - 32 - 10) // The user cannot move her character off the screen.
      heroY -= 5;
  }
  if (40 in keysDown) { // Player is holding down key
    if ((heroY + 5) >= 10 && (heroY + 5) <= canvas.height - 32 - 10)
      heroY += 5;
  }
  if (37 in keysDown) { // Player is holding left key
    {
      heroImage.src = `images/${level}-left.png`;
      if ((heroX - 5) >= 10 && (heroX - 5) <= canvas.width - 32)
        heroX -= 5;
    }
  }
  if (39 in keysDown) { // Player is holding right key
    {
      heroImage.src = `images/${level}-right.png`;
      if ((heroX + 5) >= 10 && (heroX + 5) <= canvas.width - 32)
        heroX += 5;
    }
  }
  const monsterArr = [0, 1, 2, 3];

  // Touch mushroom
  if (
    heroX <= (mushroomX + 25)
    && mushroomX <= (heroX + 25)
    && heroY <= (mushroomY + 25)
    && mushroomY <= (heroY + 25)) {
    level = "red";
    mushroomReady = false;
  }

  // Check if player and monster collided. Our images
  // are about 32 pixels big.
  if (
    heroX <= (monsterX + 25)
    && monsterX <= (heroX + 25)
    && heroY <= (monsterY + 25)
    && monsterY <= (heroY + 25)
  ) {
    // Pick a new location for the monster.
    monsterX = Math.random() * (canvas.width - 50);
    monsterY = Math.random() * (canvas.height - 50);
    // Swap random monster
    let iM = Math.floor(Math.random() * 3);
    monsterImage.src = `images/monster${monsterArr[iM]}.png`;
    score += 1;
    if (score == 10) {
      // show mushroom
      mushroomReady = true;
    }

    if (score >= 20) {
      newRecord = seconds;
      controlScreen = true;
      message = "Mission Complete";
      strInBtn = "RESTART";
    }
  }

};

/**
 * This function, render, runs as often as possible.
 */
var render = function () {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (controlScreen) {
    startedAt = new Date().getTime();
    drawControlScreen(message, strInBtn);
    return;
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY);
  }
  if (monsterReady) {
    ctx.drawImage(monsterImage, monsterX, monsterY);
  }
  if (mushroomReady) {
    ctx.drawImage(mushroomImage, mushroomX, mushroomY);
  }
  ctx.font = "25px VT323";
  ctx.fillText(`Score: ${score}/20`, 10, 15);
  let MaxWidthText_time = 90;
  ctx.fillText(`Time: ${seconds}`, canvas.width - MaxWidthText_time - 10, 15, MaxWidthText_time);

};

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */
var main = function () {
  render();
  if (!controlScreen)
    update();
  // Request to do this again ASAP. This is a special method
  // for web browsers.
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
loadImages();
setupKeyboardListeners();
main();

//Hanel click event
canvas.addEventListener('click', (evnet) => {
  if (controlScreen) {
    if (isClicked(getMouseCoordinate(event), startBtn)) {
      controlScreen = false;
      console.log(currentRecord);
      if (currentRecord > 0) {
        currentRecord = newRecord < currentRecord ? newRecord : currentRecord;
      } else {
        currentRecord = newRecord;
      }
      console.log(currentRecord);
      score = 15;
    }
  }
})


function drawControlScreen(message, strInBtn) {

  startBtn.width = 85;
  startBtn.height = 40;
  startBtn.x = canvas.width / 2 - startBtn.width / 2;
  startBtn.y = welMess_y + 10;
  welMess_x = canvas.width / 2 - welMess_len / 2;
  welMess_y = 150;
  START_x = canvas.width / 2 - 50 / 2;
  START_y = welMess_y + startBtn.height + 5
  START_len = 50;
  ctx.fillStyle = "#23401d";
  ctx.font = "50px VT323";

  ctx.fillText(message, welMess_x, welMess_y, welMess_len);
  ctx.fillRect(startBtn.x, startBtn.y, startBtn.width, startBtn.height);
  ctx.fillStyle = "white";
  ctx.fillText(strInBtn, START_x, START_y, START_len);
  // complete => show timer
  if (message == "Mission Complete") {

    if (newRecord < currentRecord) {
      ctx.fillText(`WOW! New record: ${newRecord}s`, welMess_x + 20 - 50, START_y + 70, 250);
    }
    else {
      ctx.font = "30px VT323";
      ctx.fillText(`Time: ${newRecord}s`, welMess_x + 20, START_y + 70, welMess_len);
      if (currentRecord > 0) {
        ctx.fillText(`The best: ${currentRecord}s`, welMess_x + 20, START_y + 90, welMess_len + 50);
      }
    }

  }
}

function isClicked(pos, rect) {
  return (
    pos.x > rect.x &&
    pos.x < rect.x + rect.width &&
    pos.y < rect.y + rect.height &&
    pos.y > rect.y
  );
}
function getMouseCoordinate(event) {
  return {
    x: event.pageX,
    y: event.pageY
  }
}

function isHighScore(newRecord) {
  if (currentRecord == 0) {
    return true;
  }
  if (newRecord < currentRecord) {
    return true;
  }
  return false;
}