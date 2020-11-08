//////////////////////////////////////////////////////////////////////////
// UNTITLED GAME
// JENNY FENG
//////////////////////////////////////////////////////////////////////////

// GLOBAL DEFINITIONS ////////////////////////////////////////////////////
// Setting up Canvas - Get canvas element from html doc
// set drawing context for canvas area w/ 2D attributes
const game = document.getElementById('game');

//maybe i can use this to calculated the intercepts
// const computedStyle = getComputedStyle(game);
// const compheight = computedStyle.height;
// const compwidth = computedStyle.width;

const ctx = game.getContext('2d');
game.height = window.innerHeight * 0.75;
game.width = game.height / 1.75; //ratioed

addEventListener('resize', () => {
  game.height = window.innerHeight * 0.75;
  game.width = game.height / 1.75;
});

// Array of different colors that will be used
//const colors = ['#AC92EB', '#4FC1E8', '#A0D568', '#FFCE54', '#ED5564']; //pastels
const allColors = ['#F5759B', '#D91D25', '#F7AE00', '#01C013', '#008DD4'];
let colors = [];
let randomCol = allColors[rand(0, allColors.length)];
let otherCol = allColors.filter((col) => col !== randomCol);
let randomCol2 = otherCol[rand(0, otherCol.length)];

// For glowing effects of drawn elements
ctx.lineJoin = 'round'; //rounded corners
//ctx.globalCompositeOperation = 'lighter'; //LIGHTER- lightens overlapping colors

// Constant variables
const getMiddleX = game.width / 2;
const getMiddleY = game.height / 2;
const catcherWidth = (game.width / 2) * 0.7;
const catcherHeight = game.height / 20;
const catcherXpos = (getMiddleX - catcherWidth) / 2;
const catcherYpos = game.height - catcherHeight * 2;
const avgRadius = game.height / 40;

// Initialized variables
// Game state handlers
let gameState = '';
let mode = '';

// Score/life keepers
let score = 0;
let lives = 0;
// when using OR, if thing on left is falsy, then use the right side of OR
// doesnt evaluate right side
let highScore = localStorage.getItem('highScore') || 0;

// Game objects
let catchersArray = [];
let fallingArray = []; // The array of falling objects that are alive
let megaArray = []; // The array of Mega balls that are alive
let colorweight = 0;
// Timeout Functions
let initspawnLTimeout;
let initspawnRTimeout;
let initcolorSwapLTimeout;
let initcolorSwapRTimeout;
let initspawnMegaTimeout;
let spawnLTimeout;
let spawnRTimeout;
let colorSwapLTimeout;
let colorSwapRTimeout;
let spawnMegaTimeout;
let spawnMegaTimeoutDel;

let timePassed = 0;
let lastLoop = 0;

// Strings
const gameOverText = 'BIG F'.toUpperCase();
const gametitle = 'untitled.Game(idk);'.toUpperCase(); //"trippin on coding" lul
const instructions = 'Press space to start/pause'.toUpperCase();
const instructions2 = 'Use F & J keys'.toUpperCase();
const instructions3 = 'Catch matching colors'.toUpperCase();
const instructions4 = 'Beat your own High Score'.toUpperCase();
const playAgainText = 'Space to play again'.toUpperCase();

// GLOBAL FUNCTIONS //////////////////////////////////////////////////////
function rand(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function startMessage() {
  ctx.clearRect(0, 0, game.width, game.height);
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.font = '30px Montserrat Subrayada';
  ctx.fillText(`${gametitle}`, getMiddleX, getMiddleY - 140);
  ctx.font = '20px Montserrat Subrayada';
  ctx.fillText(`${instructions}`, getMiddleX, getMiddleY - 20);
  ctx.fillText(`${instructions2}`, getMiddleX, getMiddleY);
  ctx.fillText(`${instructions3}`, getMiddleX, getMiddleY + 20);
  ctx.fillText(`${instructions4}`, getMiddleX, getMiddleY + 40);
}

function gameOverMessage() {
  ctx.clearRect(0, 0, game.width, game.height);
  ctx.font = '80px Montserrat Subrayada';
  ctx.fillText(`${gameOverText}`, getMiddleX, getMiddleY);
  ctx.font = '20px Montserrat Subrayada';
  ctx.fillText(
    `Score: ${score}     High Score: ${highScore}`,
    getMiddleX,
    getMiddleY + 80
  );
  ctx.fillText(`${playAgainText}`, getMiddleX, getMiddleY + 100);
}

function pauseMessage() {
  ctx.clearRect(0, 0, game.width, game.height);
  ctx.fillText(`pause`, getMiddleX, getMiddleY);
}

// GLOBAL CLASSES ////////////////////////////////////////////////////////
// The catcher class
// checks for matching keydown listner
// renders
// randomly changes colors
class Catcher {
  constructor(width, height, x, y, key) {
    this.color = colors[rand(0, colors.length)];
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.key = key;
    this.keydown = false;

    document.addEventListener(
      'keydown',
      function (key) {
        if (key.key == this.key) {
          catcherActive.play();
          this.keydown = true;
        }
      }.bind(this)
    );

    document.addEventListener(
      'keyup',
      function (key) {
        if (key.key == this.key) {
          this.keydown = false;
        }
      }.bind(this)
    );
  }

  render() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    //TODO: turn this on?
    this.stroke();
    if (this.keydown) {
      ctx.fillRect(this.x - 5, this.y - 5, this.width + 10, this.height + 10);
    }
    if (!this.keydown) {
      ctx.fillStyle = this.color;
    }
  }

  changeColor() {
    // pick a new color not equal to previous color
    const otherColors = colors.filter((col) => col !== this.color);
    this.color = otherColors[rand(0, otherColors.length)];
  }

  stroke() {
    ctx.shadowColor = '#FFFFFF30';
    ctx.shadowBlur = 5;
    ctx.strokeStyle = '#FFFFFF30';
    ctx.lineWidth = 5;
    // ctx.beginPath();
    // ctx.moveTo(this.x + this.border, this.y);
    // ctx.lineTo(this.x + this.width - this.border, this.y);
    // ctx.quadraticCurveTo(
    //   this.x + this.width - this.border,
    //   this.y,
    //   this.x + this.width,
    //   this.y + this.border
    // );
    // ctx.lineTo(this.x + this.width, this.y + this.height - this.border);
    // ctx.quadraticCurveTo(
    //   this.x + this.width,
    //   this.y + this.height - this.border,
    //   this.x + this.width - this.border,
    //   this.y + this.height
    // );
    // ctx.lineTo(this.x + this.border, this.y + this.height);
    // ctx.quadraticCurveTo(
    //   this.x + this.border,
    //   this.y + this.height,
    //   this.x,
    //   this.y + this.height - this.border
    // );
    // ctx.lineTo(this.x, this.y + this.border);
    // ctx.quadraticCurveTo(
    //   this.x,
    //   this.y + this.border,
    //   this.x + this.border,
    //   this.y
    // );
    // ctx.closePath();
    // ctx.stroke();
  }
}

// Falling objects parent class
// renders
// updates position as it falls
class Fallingthings {
  //need an extended class
  constructor(colorweight) {
    this.x = rand(game.width / 4, (game.width / 4) * 3);
    this.y = rand(0, game.height / 8);
    this.color = colors[rand(0, colors.length)];
    this.speedX = 0;
    this.speedY = 0;
    this.spawnX = this.x;
    this.spawnY = this.y;

    this.slope = Math.random() * (0.3 - 0.15) + 0.15;
    //(Math.random() * (0.3 - 0.15) + 0.15);
    // Math.abs(-this.spawnY /
    // (rand(catcherXpos, catcherXpos + catcherWidth) - this.spawnX) ** 2);

    //falls faster with higher score, but need to recalculate slope each time
    this.gravity = 0.5;
    this.gravitySpeed = 0;
    //sets direction the ball will fall
    this.direction = 1;
    //todo: tweak these settings
    this.bounce = 1;
    this.radius = avgRadius;
    this.match = false;
    this.alive = true; //if color matches catcher, change to true
    this.caught = false;

    this.keeprendering = true;
    this.colorweight = colorweight;

    this.motionTrailArr = [];
    this.motionTrailLength = 30;
  }

  lastPosition(x, y) {
    // called after the object is moved to a new position
    // saves it in the motion trail array
    // deletes the first element to constantly update
    this.motionTrailArr.push({ x: x, y: y });
    if (this.motionTrailArr.length > this.motionTrailLength) {
      this.motionTrailArr.shift();
    }
  }

  render() {
    // Renders the motion trail path based on the positions of the ball
    // in the last 10 frames
    for (let i = 0; i < this.motionTrailArr.length; i++) {
      // opacity should be in reverse
      // the last element of motion trail array is the closest to the current position
      let trailopacity = Math.max(0.5, i / 30); //i/20*.75
      let trailradius = (i / 30) * this.radius;

      ctx.beginPath();
      ctx.arc(
        this.motionTrailArr[i].x,
        this.motionTrailArr[i].y,
        trailradius,
        0,
        2 * Math.PI,
        true
      );
      //#00000090
      // converts to hex

      //use begin path to create a raindrop shape

      //ctx.fillStyle = `${this.color}${trailopacity.toString(16)}`;
      // parse hexadecimal color substring as 16 radix (hexadecimal)
      //turns to rgb values

      const r = parseInt(this.color.substring(1, 3), 16);
      const g = parseInt(this.color.substring(3, 5), 16);
      const b = parseInt(this.color.substring(5, 7), 16);

      ctx.fillStyle = `rgba(${r},${g},${b},${trailopacity})`;
      ctx.fill();
    }

    ctx.beginPath();
    //x coor, y coor, radius, start angle, end angle
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  fall(timeMultiplier) {
    this.lastPosition(this.x, this.y);
    this.speedY += this.gravity * timeMultiplier;
    this.y += this.speedY + this.gravitySpeed;
    this.x +=
      this.direction *
      Math.sqrt((this.y - game.height) / -this.slope) *
      timeMultiplier;
    if (this.caught) {
      this.bounceObj();
    }

    if (this.y > game.height || this.x > game.width || this.x < 0) {
      hit.play();
      this.keeprendering = false;
    }
  }

  bounceObj() {
    if (this.y > catcherYpos - this.radius) {
      this.y = catcherYpos - this.radius;
      //this.gravitySpeed = -(this.gravitySpeed * this.bounce);
      this.speedY = -this.speedY * 0.65;
    }
  }

  weightedColors(catcherColor) {
    // Creates a new array and fills it with the catcher color
    // We then concatenate the original colors list + the new array for a weighted array list
    this.weightedColor = new Array(this.colorweight)
      .fill(catcherColor)
      .concat(colors);
    // Then we return a random color from the weighted array
    this.newcolor = this.weightedColor[rand(0, this.weightedColor.length)];
    return this.newcolor;
  }
}

// Falling objects exntended classes
class FallingthingsL extends Fallingthings {
  constructor(catcherColor) {
    super();

    this.x = rand(0, game.width / 10);
    this.y = rand(0, game.height / 20);
    this.color = this.weightedColors(catcherColor);
    this.direction = 1;
  }
  //collision detection manages score + life keeping in the event of a collision
  collisionDetection() {
    // every time it updates, it checks if its at or past the collision line
    // so its detecting one object multiple times as its updating every few ms
    //

    if (this.y > catcherYpos - this.radius) {
      // if it passes the floor, take it out of the array
      const keydown = catcherR.keydown;
      this.alive = false;
      // if keydown + matching
      // +score
      if (keydown && this.color == catcherR.color) {
        this.caught = true;
        plusScore.play();
        score++;
      }
      // if not matching + keydown >> -1 life
      // if matching and no keydown >> -1 life
      if (
        (!keydown && this.color == catcherR.color) ||
        (keydown && this.color !== catcherR.color)
      ) {
        minusLife.play();
        lives--;
      }
    }
  }
}

class FallingthingsR extends Fallingthings {
  constructor(catcherColor) {
    super();

    this.x = rand((game.width / 10) * 10, game.width);
    this.y = rand(0, game.height / 20);
    this.color = this.weightedColors(catcherColor);
    this.direction = -1;
  }

  collisionDetection() {
    // every time it updates, it checks if its at or past the collision line
    // so its detecting one object multiple times as its updating every few ms
    //

    if (this.y > catcherYpos - this.radius) {
      // if it passes the floor, take it out of the array
      const keydown = catcherL.keydown;
      this.alive = false;
      // if keydown + matching
      // +score
      if (keydown && this.color == catcherL.color) {
        this.caught = true;
        plusScore.play();
        score++;
      }
      // if not matching + keydown >> -1 life
      // if matching and no keydown >> -1 life
      if (
        (!keydown && this.color == catcherL.color) ||
        (keydown && this.color !== catcherL.color)
      ) {
        minusLife.play();
        lives--;
      }
    }
  }
}

class FallingThingsMega extends Fallingthings {
  constructor() {
    super();
    this.x = rand(0, game.width);
    this.y = rand(0, game.height / 20);
    this.radius = game.height / 20;
    this.gravity = 0.5;
    // if less than 0.5, give -1, else 1
    //direction is dx
    this.direction = Math.random() < 0.5 ? -1 : 1;
    this.slope = Math.random();
    this.color = '#FFFFFF';
  }

  fall() {
    this.lastPosition(this.x, this.y);

    this.y += this.gravity + this.slope;
    this.x += this.direction + this.slope;

    // boucning the ball
    if (this.y + 0 > game.height || this.y - 0 < 0) {
      this.gravity = -this.gravity;
    }
    if (this.x + 0 > game.width || this.x - 0 < 0) {
      this.direction = -this.direction;
    }
  }

  // remove falling drops that it hits - destroy falling objects

  //change in x and change in y
  collisionDetection() {
    for (const obj of fallingArray) {
      //(x1-x2)*(x1-x2) + (y1-y2)*(y1-y2);
      let pointDist = (this.x - obj.x) ** 2 + (this.y - obj.y) ** 2;
      if (pointDist < this.radius + obj.radius + 100) {
        obj.color = '#FFFFFF';
        obj.alive = false;
        obj.gravity = 3;
        //obj.keeprendering = false;
        objkilled.play();
      }
    }
  }
}

// AUDIO STUFF ///////////////////////////////////////////////////////////
// Sound class that manages all the SFX
class Sound {
  constructor(src) {
    this.sound = document.createElement('audio');
    this.sound.src = src;
    this.sound.volume = 0.6;
    this.sound.setAttribute('preload', 'auto');
    this.sound.setAttribute('controls', 'none');
    this.sound.style.display = 'none';
    document.body.appendChild(this.sound);
  }
  play() {
    this.sound.play();
  }
  stop() {
    this.sound.pause();
  }
}

// Audio
let bgmtracks = ['audio/bgm.mp3', 'audio/bgm2.mp3', 'audio/bgm3.mp3']
hit = new Sound('audio/bong_001.ogg');
plusScore = new Sound('audio/phaserUp3.ogg');
minusLife = new Sound('audio/phaserDown3.ogg');
catcherActive = new Sound('audio/tone1.ogg');
objkilled = new Sound('audio/zap1.ogg');


// FUNCTIONS /////////////////////////////////////////////////////////////

// CREATING ELEMENTS //////////////////////////////////////////////////////////////////

// Creating the catchers
// Catcher array to hold all the catcher instances

// Creating the falling objects
// These functions all use setTimeout to set a random timeout until the next object is created/color swap
// This is for more randomness
function spawnL() {
  if (gameState == 'play') {
    // we pass the catcher on the opposite side since it is supposed to match that one
    fallingArray.push(new FallingthingsL(catcherR.color, colorweight));
  }
  spawnLTimeout = setTimeout(function () {
    spawnL();
  }, rand(1000, Math.max(6000 / (score + 1), 2000)));
}

function spawnR() {
  if (gameState == 'play') {
    fallingArray.push(new FallingthingsR(catcherL.color, colorweight));
  }
  spawnRTimeout = setTimeout(function () {
    spawnR();
  }, rand(1000, Math.max(6000 / (score + 1), 2000)));
}

function colorSwapL() {
  catcherL.changeColor();
  colorSwapLTimeout = setTimeout(function () {
    colorSwapL();
  }, rand(9000, 20000));
}

function colorSwapR() {
  catcherR.changeColor();
  colorSwapRTimeout = setTimeout(function () {
    colorSwapR();
  }, rand(9000, 20000));
}

// if mega already in play (megaArray.length>1, delete and set new timeout)
function spawnMega() {
  if (gameState == 'play') {
    megaArray.push(new FallingThingsMega(colorweight));
  }
  spawnMegaTimeoutDel = setTimeout(function () {
    for (mega of megaArray) {
      mega.keeprendering = false;
      mega.alive = false;
    }
    megaArray.shift();
    //mega.keeprendering = false;
  }, 20000);
  spawnMegaTimeout = setTimeout(function () {
    spawnMega();
  }, rand(20000, 40000));
}

// RENDER //////////////////////////////////////////////////////////////
// This function is only in charge of rendering the current state of the game - *never call updates from render
function render() {
  ctx.clearRect(0, 0, game.width, game.height);
  ctx.font = '30px Montserrat Subrayada';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(`Score: ${score}`, 100, 40);
  ctx.fillText(`Lives: ${lives}`, game.width - 100, 40);
  //ctx.save();

  // Renders catchers
  for (const catcher of catchersArray) {
    catcher.render();
  }
  // Renders objects in fallingArray
  for (const obj of fallingArray) {
    obj.render();
  }

  for (const obj of megaArray) {
    obj.render();
  }
}

// UPDATE //////////////////////////////////////////////////////////////
// Updates the state of all falling objects with every game loop
// Takes the amount of time passed since last loop as an argument
// And passes to each object instance, to smooth rendering
function updateFallingThings(timePassed) {
  for (const obj of fallingArray) {
    // Call fall class function and update object's position
    obj.fall(timePassed);
    // If the object is alive, check for collision with catcher
    // If dead, don't check and let it pass without calling collision rules
    if (obj.alive) {
      obj.collisionDetection();
    }
  }

  for (const mega of megaArray) {
    mega.fall(timePassed);
    mega.collisionDetection();
    //obj.coll
  }

  // Filter the falling array with only objects that should continue to render
  // These can be dead or alive
  fallingArray = fallingArray.filter((obj) => obj.keeprendering);

  // When the number of lives hits 0, stop tell the gameLoop to stop rendering
  if (lives == 0) {
    gameState = 'over';
  }
}

// MAIN GAME LOOP //////////////////////////////////////////////////////
// The gameloop handles and updates all the macro game logic, renders, and game states
// It is an animation function that we pass through requestanimationframe
// And requestanimationframe uses it to continuously callback and update before the next frame is painted
// The 'now' variable is always passed through the callback (gameloop) function
// 'now' = dom timestamp in ms= current time since time of origin
function gameLoop(now) {
  timePassed = (now - lastLoop) / 1000;
  // save the current timestamp as lastloop for next frame
  lastLoop = now;
  if (gameState == 'pause') {
    pauseMessage();
    requestAnimationFrame(gameLoop);
  } else if (gameState == 'over') {
    // game is over
    // save local high score
    if (score > highScore) {
      localStorage.setItem('highScore', score);
      highScore = localStorage.getItem('highScore');
    }
    gameOverMessage();
  } else {
    // timepassed = the time passed since the last frame was called/1000 (since it is in ms)
    // lastloop var is the timestamp of the time we last called gameloop

    // continue rendering with each gameloop
    updateFallingThings(timePassed);
    render();
    requestAnimationFrame(gameLoop);
  }
}

// what states lead to what settings
// create a flow diagram
//

// INIT //////////////////////////////////////////////////////////////////
// Things inside are not global, only exist inside the init scope
// Init handles all initialization and creation of the actual game objects + state
// Should not create new functional functions/etc in here
function init() {
  // initial space to start game
  // We are now in the 'play' state
  gameState = 'play';

  bgm = new Sound(bgmtracks[rand(0,3)]);
  bgm.sound.volume = 0.2;
  bgm.sound.loop = true;
  bgm.play();

  catchersArray = [
    (catcherL = new Catcher(
      catcherWidth,
      catcherHeight,
      catcherXpos,
      catcherYpos,
      'f'
    )),
    (catcherR = new Catcher(
      catcherWidth,
      catcherHeight,
      catcherXpos + getMiddleX,
      catcherYpos,
      'j'
    )),
  ];

  initspawnLTimeout = setTimeout(function () {
    spawnL();
  }, 500);

  initspawnRTimeout = setTimeout(function () {
    spawnR();
  }, 500);

  initcolorSwapLTimeout = setTimeout(function () {
    colorSwapL();
  }, 5000);

  initcolorSwapRTimeout = setTimeout(function () {
    colorSwapR();
  }, 5000);

  initspawnMegaTimeout = setTimeout(function () {
    spawnMega();
  }, 1000);
}

function reset() {
  gameState = '';
  timePassed = 0;
  lastLoop = 0;
  score = 0;
  colors = [];
  randomCol = allColors[rand(0, allColors.length)];
  otherCol = allColors.filter((col) => col !== randomCol);
  randomCol2 = otherCol[rand(0, otherCol.length)];

  catchersArray = [];
  fallingArray = [];
  megaArray = [];

  clearTimeout(initspawnLTimeout);
  clearTimeout(initspawnRTimeout);
  clearTimeout(initcolorSwapLTimeout);
  clearTimeout(initcolorSwapRTimeout);
  clearTimeout(initspawnMegaTimeout);
  clearTimeout(spawnLTimeout);
  clearTimeout(spawnRTimeout);
  clearTimeout(colorSwapLTimeout);
  clearTimeout(colorSwapRTimeout);
  clearTimeout(spawnMegaTimeout);
  clearTimeout(spawnMegaTimeoutDel);

  bgm.sound.src = '';

  if (mode == 'easy') {
    colors = [randomCol, randomCol2];
    colorweight = 5;
    lives = 10;
  } else if (mode == 'hard') {
    colors = allColors;
    colorweight = 3;
    lives = 5;
  }
}

function handleKeyUp(key) {
  if (key.key !== ' ') {
    return;
  }

  if (!gameState) {

    init();
    requestAnimationFrame(gameLoop);
  } else if (gameState == 'over') {
    reset();
    startMessage();
  } else {
    gameState = gameState == 'pause' ? 'play' : 'pause';
  }
}

// After dom has loaded, check for space key press to initialize a game with given parameters
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('easy').addEventListener('click', function () {
    document.addEventListener('keyup', handleKeyUp);
    document.getElementById('easy').style.display = 'none';
    document.getElementById('hard').style.display = 'none';
    mode = 'easy';
    colors = [randomCol, randomCol2];
    colorweight = 5;
    lives = 10;
    startMessage();
  });

  document.getElementById('hard').addEventListener('click', function () {
    document.addEventListener('keyup', handleKeyUp);
    document.getElementById('easy').style.display = 'none';
    document.getElementById('hard').style.display = 'none';
    mode = 'hard';
    colors = allColors;
    colorweight = 3;
    lives = 5;
    startMessage();
  });
});
