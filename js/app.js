/////////////////////////////////////////////////////////////////////////
// UNTITLED GAME
// JENNY FENG
// LAST UPDATED 11.02.2020
/////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////
// GLOBAL DEFINITIONS
/////////////////////////////////////////////////////////////////////////
// the game canvas
const game = document.getElementById('game');
const ctx = game.getContext('2d');

// available colors
//const colors = ['#AC92EB', '#4FC1E8', '#A0D568', '#FFCE54', '#ED5564'];
const colors = ['#F5759B', '#D91D25', '#F7AE00', '#01C013', '#008DD4'];

// scale w + h and set as a variable
const computedStyle = getComputedStyle(game);
const height = computedStyle.height;
const width = computedStyle.width;
game.height = parseInt(height);
game.width = parseInt(width);

// game.setAttribute("height", parseInt(getComputedStyle(game)["height"]))
// game.setAttribute("width", parseInt(getComputedStyle(game)["width"]))

//868x443

// for glow effect
ctx.lineJoin = 'round';
ctx.globalCompositeOperation = 'lighter';

//score, lives, etc.
let continueGame = true;
let score = 0;
let lives = 50;
let fallingArray = [];
const midX = game.width / 2 - this.width / 2;
const midY = game.height - this.height;
let catcherL;
let catcherR;
const gameOver = 'BIG F';

/////////////////////////////////////////////////////////////////////////
//FUNCTIONS + Classes
/////////////////////////////////////////////////////////////////////////

// globally used rand function
function rand(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

////////////////CLASSES///////////////////
//catcher class
// checks for matching keydown listner
// renders
// randomly changes colors

class Catcher {
  //basket
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
          console.log('space down');
          this.keydown = true;
        }
      }.bind(this)
    );

    document.addEventListener(
      'keyup',
      function (key) {
        if (key.key == this.key) {
          console.log('space up');
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
    ctx.shadowBlur = 5;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 7.5;
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

////////////////CLASSES///////////////////
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
    this.gravity = 0.1;
    // this.gravitySpeed = 0;
    this.radius = 20;
    this.match = false;
    this.alive = true; //if color matches catcher, change to true
    this.interval = setInterval(this.fall.bind(this), 60);
  }

  render() {
    ctx.beginPath();
    // x coor, y coor, radius, start angle, end angle
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  position() {
    this.speedY += this.gravity;
    this.y += this.speedY;
  }

  fall() {
    // update position
    this.position();
    //render new postiion

    const floor = game.height - this.radius;
    if (this.y > floor) {
      this.alive = false;
      clearInterval(this.interval);
    }
  }
}

////////////////CLASSES///////////////////
//falling objects exntended classes
// changes origin of spawn and direction of slope as it drops
class FallingthingsL extends Fallingthings {
  constructor() {
    super();
    this.slope = 8;
    this.x = rand(0, game.width / 5);
    this.y = rand(0, game.height / 16);
  }
  position() {
    this.speedY += this.gravity;
    this.y += this.speedY;
    this.x += this.slope;
  }
}

////////////////CLASSES///////////////////
class FallingthingsR extends Fallingthings {
  constructor() {
    super();
    this.slope = 8;
    this.x = rand((game.width / 5) * 5, game.width);
    this.y = rand(0, game.height / 16);
  }
  position() {
    this.speedY += this.gravity;
    this.y += this.speedY;
    this.x -= this.slope;
  }
}

//catcher array to hold all the catcher instances
const catchersArray = [
  (catcherL = new Catcher(300, 20, 30, game.height - 20, 'f')),
  (catcherR = new Catcher(300, 20, game.width - 330, game.height - 20, 'j')),
];

//collision detection manages score + life keeping in the event of a collision
function collisionDetection(obj, catcher) {
  if (obj.y >= game.height - catcher.height) {
    const keydown = catcher.keydown;
    console.log('hit detected');
    // if keydown + matching
    // +score
    if (keydown && obj.color == catcher.color) {
      console.log('+ score');
      score++;
    }
    // if not matching + keydown >> -1 life
    // if matching and no keydown >> -1 life
    if (
      (!keydown && obj.color == catcher.color) ||
      (keydown && obj.color !== catcher.color)
    ) {
      console.log(keydown, obj.color, catcher.color);
      lives -= 1;
      console.log('-1 life' + lives);
    }
    /// maybe use switches
  }
}

//manges all the randomized intervals for object generation
function update() {
  //reset random intervals so theyre actually random


  setInterval(() => {
    //fallingArray.push(new Fallingthings());
    fallingArray.push(new FallingthingsL());
  }, rand(1000/(score+1), 2000/(score+1)));

  setInterval(() => {
    //fallingArray.push(new Fallingthings());
    fallingArray.push(new FallingthingsR());
  }, rand(1000/(score+1), 2000/(score+1)));

  // tried to make spawn faster with higher score, but it doesnt seem to be going faster?


  //change color at random intervals for every catcher
  setInterval(function () {
    catcherL.changeColor();
    console.log(catcherL);
  }, rand(10000, 18000));

  setInterval(function () {
    catcherR.changeColor();
  }, rand(10000, 18000));
}

function render() {
  //never call updates from render
  ctx.clearRect(0, 0, game.width, game.height);

  ctx.font = "30px Montserrat Subrayada";
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(`Score: ${score}`, 10, 40);
  ctx.fillText(`Lives: ${lives}`, game.width - 150, 40);

  // render every catcher
  for (const catcher of catchersArray) {
    catcher.render();
  }

  for (const x of fallingArray) {
    x.render();
    collisionDetection(x, catcherL);
    collisionDetection(x, catcherR);
  }
  //check if all objects in array are alive, filter out dead falling objects
  // call fall on all alive objects in array

  fallingArray = fallingArray.filter((thing) => thing.alive);

  if (lives == 0) {
    continueGame = false;
    ctx.clearRect(0, 0, game.width, game.height);
    ctx.font = "200px Montserrat Subrayada";
    ctx.fillText(`${gameOver}`, 200, game.height / 2);
  }

  if (continueGame) {
    requestAnimationFrame(render);
  }
}

// function startGame(){
//   ctx.fillStyle = "white";
//   ctx.textAlign ="center";
//   ctx.font = "30px Montserrat Subrayada";
//   ctx.fillText("Press Space to start", game.width/2, game.height / 2);
//   ctx.fillText("Use 'f' and 'j' to catch the falling balls the match the color of the bar.", game.width/2, game.height / 2 + 30);
//   ctx.fillText("Backspace to reset", game.width/2, game.height / 2 +60);
// }


document.addEventListener('DOMContentLoaded', function () {

  // startGame();



  document.addEventListener('keyup', function (key) {

    if (key.key == " ") {
      update();
      render();
    }
  });
});



// }

// function draw(url)
// {
//     // Create an image object. This is not attached to the DOM and is not part of the page.
//     var image = new Image();

//     // When the image has loaded, draw it to the canvas
//     image.onload = function()
//     {
//         ctx.drawImage(image, 360, 600, 200, 200);
//         ctx.drawImage(image, 50, 600, 200, 200);
//     }

//     // Now set the source of the image that we want to load
//     image.src = url;
// }

// draw('D:/SEI1019/ga-projects/untitled-game/img/nokey.gif');

//TODO:

// RESET
// ADD DIRECTIONS BEFORE START

// make the game playable for humans
//primary gameplay loop - what's happening every second
//secondary gameplay loop - levels

//later
// design updates
