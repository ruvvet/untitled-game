// GLOBAL DEFINITIONS
/////////////////////////////////////////////////////////////////////////
// the game canvas
const game = document.getElementById('game');
const ctx = game.getContext('2d');

const colors = ['#08F7FE', '#09FbD3', '#FE53BB', '#F5D300'];

const computedStyle = getComputedStyle(game);

const height = computedStyle.height;
const width = computedStyle.width;

game.height = parseInt(height);
game.width = parseInt(width);

// game.setAttribute("height", parseInt(getComputedStyle(game)["height"]))
// game.setAttribute("width", parseInt(getComputedStyle(game)["width"]))

//868x443

const gameOver = false;
const score = 0;
const lives = 10;
let fallingArray = [];
let catcherL;


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
  }

  render() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
}

  changeColor() {
    // pick a new color not equal to previous color
    const otherColors = colors.filter((col) => col !== this.color);
    this.color = otherColors[rand(0, otherColors.length)];
    return this.color;
  }
}


class Fallingthings {
  //block
  constructor() {
    this.x = rand(game.width / 4, (game.width / 4) * 3); //spawn x-coord
    this.y = rand(0, game.height / 8); //spawn y-coord
    this.color = colors[rand(0, colors.length)];
    this.speedX = 0;
    this.speedY = 0;
    this.gravity = 0.10;
    // this.gravitySpeed = 0;
    this.radius = 10;
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
    // this.gravitySpeed += this.gravity;
    // this.x += this.speedX;
    // this.y += this.speedY + this.gravitySpeed;
  }

  fall() {
    // update position
    this.position();
    //render new postiion

    const floor = game.height - this.radius;
    console.log('floor' + floor);
    if (this.y > floor) {
    console.log('it dead now');
      this.alive = false;
      clearInterval(this.interval);

    }
  }


}

catcherL= new Catcher(220, 10, 'space');

function scoreManager(){

}


// function collisionDetection(obj, catcher){
//       if (obj.y >= game.height-10){
//           console.log('hit detected');
//           if (obj.color == )

//       }

//   }



function update() {

  setInterval(() => {
    fallingArray.push(new Fallingthings());
  }, rand(1000, 2000));

  setInterval(()=>{
    catcherL.changeColor;
    catcherL.color = catcherL.changeColor();
    }, rand(5000, 10000));

    /////???????????? better way to do this???


  //frames per sec = amt of times it is rendered per x ms
  //update = tick rate - # of times the canvas is evaluated per second

    document.getElementById("header").textContent = "Score:" + score;




}

function render() {
  //never call updates from render
  ctx.clearRect(0, 0, game.width, game.height);
  catcherL.render();

  for (const x of fallingArray) {
    x.render();
    //collisionDetection(x, catcherL.color);

  }
//check if all objects in array are alive, filter out dead falling objects
  // call fall on all alive objects in array


  fallingArray = fallingArray.filter((thing) => thing.alive);
  console.log(fallingArray);

  requestAnimationFrame(render);
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
