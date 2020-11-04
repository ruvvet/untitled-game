/////////////////////////////////////////////////////////////////////////
// UNTITLED GAME
// JENNY FENG
// LAST UPDATED 11.03.2020
/////////////////////////////////////////////////////////////////////////

//GLOBAL DEFINITIONS/////////////////////////////////////////////////////
// Setting up Canvas
// Get canvas element from html doc
// set drawing context for canvas area w/ 2D attributes
const game = document.getElementById('game');
const ctx = game.getContext('2d');
// Scaling canvas - default is 300x150
// Use getComputedStyle to grab the css h + w attributes of game
//and set the h+w manually
const height = getComputedStyle(game).height;
const width = getComputedStyle(game).width;
game.height = parseInt(height);
game.width = parseInt(width);

// Array of different colors that will be used
//const colors = ['#AC92EB', '#4FC1E8', '#A0D568', '#FFCE54', '#ED5564']; //pastels
const colors = ['#F5759B', '#D91D25', '#F7AE00', '#01C013', '#008DD4']; //solids

// For glowing effects of drawn elements
ctx.lineJoin = 'round'; //rounded corners
ctx.globalCompositeOperation = 'lighter'; //lightens overlapping colors

// Constant variables
const getMiddleX = game.width / 2;
const getMiddleY = game.height / 2;
const catcherWidth = (game.width / 2) * 0.7;
const catcherHeight = game.height / 20;
const catcherXpos = (getMiddleX - catcherWidth) / 2;
const catcherYpos = game.height - catcherHeight;

// Initialized variables
let continueGame = true;
let score = 0;
let lives = 50;
let fallingArray = []; //the array of falling objects that are alive
let catcherL;
let catcherR;
let timePassed = 0;
let lastLoop = 0;

// Audio
let hit;
let plusScore;
let minusLife;
let catcherActive;
let bgmusic;

// Strings
const gameOver = 'BIG F'.toUpperCase();
const instructions = 'Press space to start'.toUpperCase();
const instructions2 = "Control L/R catchers with 'F' and 'J'".toUpperCase();
const instructions3 = 'Space to Pause'.toUpperCase();

// Globally used rand function
function rand(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function init(colors, lives) {

  colors = colors;
  lives = lives;

  startMessage();
  document.addEventListener('keyup', function (key) {
    if (key.key == ' ') {
      initGame();
      requestAnimationFrame(gameLoop);
    }
  });

  /////////////////////////////////////////////////////////////////////////
  //FUNCTIONS + Classes
  /////////////////////////////////////////////////////////////////////////

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
      //this.stroke();
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
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(this.x + this.border, this.y);
      ctx.lineTo(this.x + this.width - this.border, this.y);
      ctx.quadraticCurveTo(
        this.x + this.width - this.border,
        this.y,
        this.x + this.width,
        this.y + this.border
      );
      ctx.lineTo(this.x + this.width, this.y + this.height - this.border);
      ctx.quadraticCurveTo(
        this.x + this.width,
        this.y + this.height - this.border,
        this.x + this.width - this.border,
        this.y + this.height
      );
      ctx.lineTo(this.x + this.border, this.y + this.height);
      ctx.quadraticCurveTo(
        this.x + this.border,
        this.y + this.height,
        this.x,
        this.y + this.height - this.border
      );
      ctx.lineTo(this.x, this.y + this.border);
      ctx.quadraticCurveTo(
        this.x,
        this.y + this.border,
        this.x + this.border,
        this.y
      );
      ctx.closePath();
      ctx.stroke();
    }
  }

  //falling objects class
  // renders
  // updates position as it falls

  class Fallingthings {
    //need an extended class
    constructor() {
      this.x = rand(game.width / 4, (game.width / 4) * 3);
      this.y = rand(0, game.height / 8);
      this.color = colors[rand(0, colors.length)];
      this.speedX = 0;
      this.speedY = 0;
      this.gravity = 0.3;
      //this.gravitySpeed = 0;
      //TODO:this.bounce = 1;
      this.radius = 20;
      this.match = false;
      this.alive = true; //if color matches catcher, change to true
      this.keeprendering = true;
    }

    render() {
      ctx.beginPath();
      // x coor, y coor, radius, start angle, end angle
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();


    }
  }

  // Falling objects exntended classes
  class FallingthingsL extends Fallingthings {
    constructor(catcherColor) {
      super();
      this.slope = Math.random() * (0.09 - 0.04) + 0.04;
      this.x = rand(0, game.width / 10);
      this.y = rand(0, game.height / 20);
      this.color = this.weightedColors(catcherColor);
    }

    fall(timeMultiplier) {
      this.speedY += this.gravity * timeMultiplier;
      this.y += this.speedY; // + this.gravitySpeed;
      // parabola - make it travel along a range of paths
      this.x +=
        Math.sqrt((this.y - game.height) / -this.slope) * timeMultiplier;
      //this.bounce();

      if (this.y > game.height) {
        hit.play();
        this.keeprendering = false;
      }
    }

    //   bounce(){
    //     if (this.y > game.height-this.radius) {
    //  this.y =game.height-this.radius;
    //  this.gravitySpeed = -(this.gravitySpeed * this.bounce);
    // }
    // }

    weightedColors(catcherColor) {
      // Creates a new array and fills it with the catcher color
      // We then concatenate the original colors list + the new array for a weighted array list
      this.weightedColor = new Array(5).fill(catcherColor).concat(colors);
      // Then we return a random color from the weighted array
      this.newcolor = this.weightedColor[rand(0, this.weightedColor.length)];
      return this.newcolor;
    }
  }

  class FallingthingsR extends Fallingthings {
    constructor(catcherColor) {
      super();
      this.slope = Math.random() * (0.09 - 0.04) + 0.04;
      this.x = rand((game.width / 10) * 10, game.width);
      this.y = rand(0, game.height / 20);
      this.color = this.weightedColors(catcherColor);
    }
    fall(timeMultiplier) {
      this.speedY += this.gravity * timeMultiplier;
      this.y += this.speedY;
      this.x -=
        Math.sqrt((this.y - game.height) / -this.slope) * timeMultiplier;

      if (this.y > game.height) {
        hit.play();
        this.keeprendering = false;
      }
    }
    weightedColors(catcherColor) {
      this.weightedColor = new Array(5).fill(catcherColor).concat(colors);
      this.newcolor = this.weightedColor[rand(0, this.weightedColor.length)];
      return this.newcolor;
    }
  }

  // Catcher array to hold all the catcher instances
  // Passes width, height,x-, y-, and key to activate
  const catchersArray = [
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

  //collision detection manages score + life keeping in the event of a collision
  function collisionDetection(obj, catcher) {
    // every time it updates, it checks if its at or past the collision line
    // so its detecting one object multiple times as its updating every few ms
    //

    if (obj.y > game.height - catcher.height - obj.radius) {
      const keydown = catcher.keydown;
      obj.alive = false;
      // if keydown + matching
      // +score
      if (keydown && obj.color == catcher.color) {
        plusScore.play();
        score++;
      }
      // if not matching + keydown >> -1 life
      // if matching and no keydown >> -1 life
      if (
        (!keydown && obj.color == catcher.color) ||
        (keydown && obj.color !== catcher.color)
      ) {
        minusLife.play();
        lives -= 1;
      }
      /// maybe use switches
    }
  }

  // These functions all use setTimeout to set a random timeout until the next object is created/color swap
  // This is for more randomness
  function spawnL() {
    // we pass the catcher on the opposite side since it is supposed to match that one
    fallingArray.push(new FallingthingsL(catcherR.color));
    setTimeout(function () {
      spawnL();
    }, rand(10, 4000));
  }

  function spawnR() {
    fallingArray.push(new FallingthingsR(catcherL.color));
    setTimeout(function () {
      spawnR();
    }, rand(10, 4000));
  }

  function colorSwapL() {
    catcherL.changeColor();
    setTimeout(function () {
      colorSwapL();
    }, rand(9000, 20000));
  }

  function colorSwapR() {
    catcherR.changeColor();
    setTimeout(function () {
      colorSwapR();
    }, rand(9000, 20000));
  }

  // Initizes all the randomized generator functions for objects + catchers
  // Calls each randomizer function after a set time
  function initGame() {
    // bgmusic = new Sound('../untitled-game/audio/mix.mp3');
    // bgmusic.sound.volume = 0.3;
    // bgmusic.play();

    setTimeout(function () {
      spawnL();
    }, 500);

    setTimeout(function () {
      spawnR();
    }, 500);

    setTimeout(function () {
      colorSwapL();
    }, 5000);

    setTimeout(function () {
      colorSwapR();
    }, 5000);

    hit = new Sound('../untitled-game/audio/bong_001.ogg');
    plusScore = new Sound('../untitled-game/audio/phaserUp3.ogg');
    minusLife = new Sound('../untitled-game/audio/phaserDown3.ogg');
    catcherActive = new Sound('../untitled-game/audio/tone1.ogg');
  }

  /// This function is only in charge of rendering the current state of the game - *never call updates from render
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
  }

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
        for (catcher of catchersArray) {
          collisionDetection(obj, catcher);
        }
      }
    }

    // Filter the falling array with only objects that should continue to render
    // These can be dead or alive
    fallingArray = fallingArray.filter((obj) => obj.keeprendering);

    // When the number of lives hits 0, stop tell the gameLoop to stop rendering
    if (lives == 0) {
      continueGame = false;
      // bgmusic.pause();
    }
  }

  function gameLoop(now) {
    // Now  var is the dom timestamp in ms
    // lastloop var is the timestamp of the time we last called gameloop
    timePassed = (now - lastLoop) / 1000;
    lastLoop = now;
    updateFallingThings(timePassed);
    render();

    if (continueGame) {
      // continue rendering with each gameloop
      requestAnimationFrame(gameLoop);
    } else {
      // game is over
      ctx.clearRect(0, 0, game.width, game.height);
      ctx.font = '100px Montserrat Subrayada';
      ctx.fillText(`${gameOver}`, getMiddleX-100, getMiddleY);
    }
  }

  function startMessage() {
    //ctx.restore();
    ctx.font = '30px Montserrat Subrayada';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(`${instructions}`, getMiddleX, getMiddleY - 30);
    ctx.fillText(`${instructions2}`, getMiddleX, getMiddleY);
    ctx.fillText(`${instructions3}`, getMiddleX, getMiddleY + 30);
  }
}

// After dom has loaded, check for space key press to initialize and start rendering
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('easy').addEventListener('click', function () {
    document.getElementById('easy').style.display = 'none';
    document.getElementById('hard').style.display = 'none';
    init(colors.slice(0,2), 20);
  });

  document.getElementById('hard').addEventListener('click', function () {
    document.getElementById('easy').style.display = 'none';
    document.getElementById('hard').style.display = 'none';
    init(colors, 10);
  });
});
