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
let controlSence = true;
let startedAt;

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
let showTime = 0;
let welMess_x, welMess_y; const welMess_len = 200;
let START_x, START_y, START_len;
let bgReady, heroReady, monsterReady;
let bgImage, heroImage, monsterImage;
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
  heroImage.src = "images/red-left.png";

  monsterImage = new Image();
  monsterImage.onload = function () {
    // show the monster image
    monsterReady = true;
  };
  monsterImage.src = "images/monster0.png";
}

function countUpTimer() {

  var now = new Date().getTime();
  var distance = now - startedAt;
  seconds = Math.floor((distance / 1000));

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
      heroImage.src = "images/red-left.png";
      if ((heroX - 5) >= 10 && (heroX - 5) <= canvas.width - 32)
        heroX -= 5;
    }

  }
  if (39 in keysDown) { // Player is holding right key
    {
      heroImage.src = "images/red-right.png";
      if ((heroX + 5) >= 10 && (heroX + 5) <= canvas.width - 32)
        heroX += 5;
    }

  }
  const monsterArr = [0, 1, 2, 3];
  // Check if player and monster collided. Our images
  // are about 32 pixels big.
  if (
    heroX <= (monsterX + 32)
    && monsterX <= (heroX + 32)
    && heroY <= (monsterY + 32)
    && monsterY <= (heroY + 32)
  ) {
    // Pick a new location for the monster.
    // Note: Change this to place the monster at a new, random location.
    monsterX = Math.random() * (canvas.width - 50);
    monsterY = Math.random() * (canvas.height - 50);
    // Swap random monster
    let iM = Math.floor(Math.random() * 3);
    monsterImage.src = `images/monster${monsterArr[iM]}.png`;
    // Score + 1
    score += 1;
    if (score >= 20) {
      showTime = seconds;
      controlSence = true;
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
  if (controlSence) {
    startedAt = new Date().getTime();
    drawControlSence(message, strInBtn);
    return;
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY);
  }
  if (monsterReady) {
    ctx.drawImage(monsterImage, monsterX, monsterY);
  }
  ctx.font = "25px VT323";
  ctx.fillText(`Score: ${score}/20`, 10, 15);
  let MaxWidthText_time = 55;
  ctx.fillText(`Time: ${seconds}`, canvas.width - MaxWidthText_time - 10, 15, MaxWidthText_time);

};

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */
var main = function () {
  render();
  if (!controlSence)
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
  if (controlSence) {
    if (isInside(getMouseCoordinate(event), startBtn)) {
      controlSence = false;
      score = 0;
    }
  }
})


function drawControlSence(message, strInBtn) {

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
    ctx.fillText(`Time: ${showTime}`, welMess_x + 20, START_y + 70, welMess_len);
  }
}

function isInside(pos, rect) {
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