// the game canvas
const game = (display = document.querySelector('#game'));
//??? const game = document.getElementById('game');

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

// set Context
//"`getContext('2d') returns an object that provides methods and properties
//for drawing and manipulating images and graphics on a canvas element in a document.
//A context object includes information about colors, line widths, fonts,
//and other graphic parameters that can be drawn on a canvas."
const ctx = game.getContext('2d');
console.log(ctx)




//create catcher class at the bottom (for 2)
// catcher should change colors
// be responsive to key down event
//

class Catcher{
    constructor(x, y, color, width, height){
        //this.key = key;
        this.x=x;
        this.y=y;
        this.color = color;
        this.width = width;
        this.height = height;

    }

    render(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}


class Falling{
    constructor(x, y, color, speed, radius){
        this.x = x; //spawn x-coord
        this.y = y; //spawn y-coord
        this.color = color;
        this.speed = speed;
        this.width = radius;
        this.match = false; //if color matches catcher, change to true

    }

    render(){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width, 0, 2 * Math.PI);
        ctx.stroke();
    }

}


// function detectFloorCollision() {
//     // if hits 876, return true/false
// }

function inputDetection(e) {}


function update(){
    ctx.clearRect(0 0 , game.width, game.height);
    // randomly spawn new objects
    // detect collision
    // detect if game over
    //change colors, etc.

}


function startGame () {
    const leftCatcher = new Catcher (220, 800, 'pink', 150, 10);
    leftCatcher.render();

}
// document.addEventListener('DOMContentLoaded', functio











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

