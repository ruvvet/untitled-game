// GLOBAL DEFINITIONS
/////////////////////////////////////////////////////////////////////////
// the game canvas
const game = document.getElementById('game');
const ctx = game.getContext('2d');

const colors = ['#08F7FE', '#09FbD3', '#FE53BB', '#F5D300'];

// ctx canvas element thinks it is 180x300 (default),
// items are stretched to fit dom element
// set hxw of game element on dom with getcomputed style

//getcomputed style >>> returns object with all css values
// set attribute of game to "height"
const computedStyle = getComputedStyle(game);

//get height/width key from the css object
const height = computedStyle.height;
const width = computedStyle.width;
//set dom attribute  - DOM
game.height = parseInt(height);
game.width = parseInt(width);

console.log(game.height); //817 PX HEIGHT
console.log(game.width); // 576 PX WIDTH

// game.setAttribute("height", getComputedStyle(game)["height"])
// game.setAttribute("width", getComputedStyle(game)["width"])

// once the size is scaled correctly, set other styling

const gameOver = false;
const score = 0;
const lives = 10;

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
  constructor(width, height, color, key) {
    this.color = color;

    this.width = width;
    this.height = height;
    this.key = key;
    this.x = game.width / 2 - this.width / 2;
    this.y = game.height - this.height;
  }

  render() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    console.log(this.x, this.y, this.width, this.height);
  }

  reset() {
    //
  }

  changeColor() {
    // pick a new color not equal to previous color
    const otherColors = colors.filter((col) => col !== this.color);
    //const otherColors = colors.filter(col => {return col !==this.color});
    this.color = otherColors[rand(0, otherColors.length)];
  }
}

// TODO: use set interval + random timer
//timer=rand(10,20s)
//setinterval(objectinstanceName.changecolor, timer)

class Fallingthings {
  //block
  constructor() {
    this.x = rand(game.width / 4, (game.width / 4) * 3); //spawn x-coord
    this.y = rand(0, game.height / 8); //spawn y-coord
    this.color = colors[rand(0, colors.length)];
    this.speedX = 0;
    this.speedY = 0;
    this.gravity = 0.05;
    // this.gravitySpeed = 0;
    this.radius = 10;
    this.match = false;
    this.alive = true; //if color matches catcher, change to true
  }

  render() {
    ctx.beginPath();
    // x coor, y coor, radius, start angle, end angle
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();

    //tx.stroke();
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
    this.render();

  }

  collisionDetection() {
    const floor = game.height - this.height;
    if (this.y > floor) {
      this.alive=false;
    }
  }
}

const leftCatcher = new Catcher(220, 50, 'pink', 150, 10);


function update() {
  ctx.clearRect(0, 0, game.width, game.height);


  if (!gameOver) {
    leftCatcher.render();

    // get random timer
    const fallTimer = rand(5000, 10000);
    console.log(fallTimer);

    //array of all currently falling objects
    const fallingArray = [];
    // set inerval to create new instance with the timer
      //setInterval((e)=> {e = new Fallingthings(); e.fall()}, fallTimer);

      setInterval(
        ()=> {
          const newThing = new Fallingthings();
          //e.render();
            fallingArray.push(newThing);
          console.log(newThing);

      }, fallTimer);

  console.log(fallingArray);



      // set random interval to create new object + push to array
//     setInterval(fallingArray.push(
//         (e)=> {
//           e = new Fallingthings();
//           //e.render();

//           console.log(e);
//           return e;
//       }), fallTimer);

//   console.log(fallingArray);

      //check if all objects in array are alive, filter out dead falling objects
      // call fall on all alive objects in array

      fallingArray.filter((thing) => thing.alive);




  const catchTimer = rand(50000, 100000);
  setInterval(leftCatcher.changeColor(), catchTimer);
  console.log(leftCatcher.color);






  }

  //requestAnimationFrame(update);
  //event loop drives every frame of a js process

  // randomly spawn new objects
  // detect collision
  // detect if game over
  //change colors, etc.
}

// function startGame () {

//     const runGame = setInterval(update, 60);

// }
// // document.addEventListener('DOMContentLoaded', functio

// startGame();

document.addEventListener('DOMContentLoaded', function () {
  var runGame = setInterval(update, 60);
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

// //<script>
// var c = document.getElementById("myCanvas");
// var ctx = c.getContext("2d");
// var img = document.getElementById("scream");
// ctx.drawImage(img, 10, 10);
// </script>

//space to start
//

//extend - fallingthings class,
// could change color halfway, or be bigger, etc
// override render function with super on parent
