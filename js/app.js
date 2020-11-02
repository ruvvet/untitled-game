// GLOBAL DEFINITIONS
/////////////////////////////////////////////////////////////////////////
// the game canvas
const game = document.getElementById('game');
const ctx = game.getContext('2d');

//const colors = ['#AC92EB', '#4FC1E8', '#A0D568', '#FFCE54', '#ED5564'];
const colors = ['#F5759B', '#D91D25', '#F7AE00', '#01C013', '#008DD4'];

const computedStyle = getComputedStyle(game);

const height = computedStyle.height;
const width = computedStyle.width;

game.height = parseInt(height);
game.width = parseInt(width);

// game.setAttribute("height", parseInt(getComputedStyle(game)["height"]))
// game.setAttribute("width", parseInt(getComputedStyle(game)["width"]))

//868x443

ctx.lineJoin = 'round';
ctx.globalCompositeOperation = 'lighter';

let continueGame = true;
let score = 0;
let lives = 10;
let fallingArray = [];
const midX = game.width / 2 - this.width / 2;
const midY = game.height - this.height;
let catcherL;
const gameOver = "BIG F";

/////////////////////////////////////////////////////////////////////////

//FUNCTIONS
/////////////////////////////////////////////////////////////////////////

function rand(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

//create catcher class at the bottom (for 2)
// catcher should change colors
// be responsive to key down event
//

class Catcher {
  //basket
  constructor(width, height, key) {
    this.color = colors[rand(0, colors.length)];
    this.width = width;
    this.height = height;
    this.key = key;
    this.x = game.width / 2 - this.width / 2;
    this.y = game.height - this.height;
    this.keydown = false;

    document.addEventListener(
      'keydown',
      function (key) {
        if (key.key == 'f') {
          console.log('space down');
          this.keydown = true;
        }
      }.bind(this)
    );

    document.addEventListener(
      'keyup',
      function (key) {
        if (key.key == 'f') {
          console.log('space up');
          this.keydown = false;
        }
      }.bind(this)
    );
  }

  render() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    this.stroke();
    if (this.keydown) {
      ctx.fillRect(this.x-5, this.y-5, this.width + 10, this.height + 10);
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

  //draw bigger rect if keydown
}

class Fallingthings {
  //block
  constructor() {
    this.x = rand(game.width / 4, (game.width / 4) * 3); //spawn x-coord
    this.y = rand(0, game.height / 8); //spawn y-coord
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

catcherL = new Catcher(220, 20, 'f');

function scoreManager() {}

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

function update() {
  setInterval(() => {
    fallingArray.push(new Fallingthings());
  }, rand(1000, 2000));

  // setInterval(catcherL.changeColor
  //   //catcherL.color = catcherL.changeColor();
  // , rand(5000, 10000));

  setInterval(function () {
    catcherL.changeColor();
  }, rand(5000, 10000));

  /////???????????? better way to do this???

  //frames per sec = amt of times it is rendered per x ms
  //update = tick rate - # of times the canvas is evaluated per second
}

function render() {
  //never call updates from render
  ctx.clearRect(0, 0, game.width, game.height);

  ctx.font = "30px 'Montserrat Subrayada";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(`Score: ${score}`, 10, 40);
  ctx.fillText(`Lives: ${lives}`, game.width-150, 40);


  catcherL.render();

  for (const x of fallingArray) {
    x.render();
    collisionDetection(x, catcherL);
    document.getElementById('header').textContent = 'Score:' + score;
    document.getElementById('footer').textContent = 'Lives:' + lives;

  }
  //check if all objects in array are alive, filter out dead falling objects
  // call fall on all alive objects in array

  fallingArray = fallingArray.filter((thing) => thing.alive);

  if (lives==0){
    continueGame = false;
    ctx.clearRect(0, 0, game.width, game.height);
    ctx.font = "100px 'Montserrat Subrayada";
    ctx.fillText(`${gameOver}`, game.width/2, game.height/2);

  }

  if (continueGame) {
    requestAnimationFrame(render);
  }
}

//requestAnimationFrame(update);
//event loop drives every frame of a js process

// function startGame () {

//     const runGame = setInterval(update, 60);

// }
// // document.addEventListener('DOMContentLoaded', functio

// startGame();

document.addEventListener('DOMContentLoaded', function () {
  update();
  render();
  //var runGame = setInterval(render, 60);
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

//space to start
