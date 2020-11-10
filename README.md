# untitled.game(idk)

Yep, that's actually the name.

## Catch the falling balls with the bar of the matching color.

Inspired by all the catcher games 🌠.
The twist is that they change colors all the time. 🔴🟠🟡🟢🔵🟣🟤⚫⚪
The bars, the balls, spawn points, and trajectory are random.

### Modes:

- 😝 Easy (you get 2 random colors, more lives, and odds are weighted in your favor)
- 😭 Hard-ish (there's 5 colors to deal with and less chances)

## How to play 🎮

> 1.  Go to [livesite](https://ruvvet.github.io).
> 2.  Catch the falling balls that match the color of the bar w/ the `f` & `j` keys.
> 3.  Successfully catching a matching ball nets your +1 point.
> 4.  Failing to catch a matching ball costs -1 life.
> 5.  Beat your own high score, the more points you get, the more balls that spawn.
> 6.  The game is over when you lose all your lives.

### SCREENSHOTS

![ss](https://github.com/ruvvet/untitled-game/blob/main/img/game.gif)

# CODE SNIPPETS

### Game state logic

Many variables control differnent asepcts of the game, but the gameState variable controls the overall flow of the user experience. Different states give different decision trees with the same user input.

```javascript
let gameState = '';

// can be '' for no game in play
// can be 'play' for game is in play - continue to render + update
// can be 'pause for when it's paused, continues to render but does not update
// can be 'over' for when the game is finalized and we're prepping to reset + move on
```

### Creating classes for major objects, such as the falling balls/objects. And extending those classes so they have different behaviors.

The falling objects parent class was extended into 3 children classes: objects that fall from the left, objects that fall from the right, and the mega balls which are there to wreak havok.

```javascript
class Fallingthings {
  //need an extended class
  constructor(colorweight) {
    // random spawn location
    this.x = rand(game.width / 4, (game.width / 4) * 3);
    this.y = rand(0, game.height / 8);
    // initializes random color
    this.color = colors[rand(0, colors.length)];
    //...
    this.match = false;
    // controls if the ball is still in play or not
    this.alive = true;
    // controls if the ball was successfully caught
    this.caught = false;
    // controls if the ball is kept rendering even if 'dead'
    this.keeprendering = true;
  }

  //...

class FallingthingsL extends Fallingthings {
  constructor(catcherColor) {
    super();

    //...

class FallingthingsR extends Fallingthings {
  constructor(catcherColor) {
    super();

    //...

class FallingThingsMega extends Fallingthings {
  constructor() {
    super();

    //...

```

### Quadratic Equations (a.k.a: I have not mathed in years)

If you havent thought about a parabola or quadratic equation in years like me, the formula `y=ax^2 + bx + c` is the quadratic formula where the a, b, and c constants control the shape of the curve. I solved for each using the vertex (spawn points) and intercept points, and plugged them back in to get the new position of my y-coordinate value for each x-coordinate. The a values needed to be calculated separately for each extended class.

```javascript
    //...
    // the timeMultiplier uses the time passed through
    // the requestanimationFrame callback
    // and using that to scale the dx + dy allows for a smoother animation
fall(timeMultiplier) {

  //..

  // dx is constantly moving in one direction scaled by the timeMult
    this.x += this.direction * timeMultiplier * 100;

      // If you havent thought about a parabola or quadratic equation in years like me,
      // the formula y=ax^2 + bx + c
      // where the a, b, and c constants control the shape of the curve
      // I solved for each using the vertex (spawn points) and intercept points
      this.y =
        this.a * this.x ** 2 -
        2 * this.a * this.x * this.spawnX +
        this.a * this.spawnX ** 2 +
        this.spawnY * timeMultiplier * this.gravity;
    }

  }

  class FallingthingsL extends Fallingthings {
  constructor(catcherColor) {
    this.a =
      (game.height - this.spawnY) /
      (rand(
        game.width - (catcherXpos + catcherWidth)+5,
        game.width - catcherXpos - 5
      ) -
        this.spawnX) **
        2;

  class FallingthingsR extends Fallingthings {
    constructor(catcherColor) {
      this.a =
        (game.height - this.spawnY) /
        (rand(catcherXpos+5, catcherXpos + catcherWidth-5) - this.spawnX) ** 2;
    }


```

### Using setTimeout to simulate random events (infinitely recursing itself)

Using a random setTimeout to call a new spawn, and then recursively calling itself with a random setTImeout range.

```javascript
// after initial call of spawn
function spawnMega() {
  // we create the new instance
  megaArray.push(new FallingThingsMega(colorweight));
  setTimeout(function () {
    for (mega of megaArray) {
      mega.keeprendering = false;
      mega.alive = false;
    }
    megaArray.shift();
    //mega.keeprendering = false;
  }, 20000);

  //then set a random timeout
  // for the next time we call the function again
  setTimeout(function () {
    spawnMega();
  }, rand(20000, 40000));
}
```

### The primary game loop

Based on the current gamestate, this function renders, updates, and then calls the next frame to be painted.

```javascript
function gameLoop(now) {
  timePassed = (now - lastLoop) / 1000;
  lastLoop = now;

  if (gameState == 'pause') {
    pauseMessage();
    requestAnimationFrame(gameLoop); // continue rendering even if paused
  } else if (gameState == 'over') {
    // game is over
    // save local high score
    if (score > highScore) {
      localStorage.setItem('highScore', score);
      highScore = localStorage.getItem('highScore');
    }
    gameOverMessage();
  } else {
    // continue updating and rendering with each gameloop, then recusively callback
    updateFallingThings(timePassed);
    render();
    requestAnimationFrame(gameLoop);
  }
}
```

### Ratioed

Almost everything is scaled to the `game.height` of the canvas, which is calculated based on the `window.innerWidth` of the player's screen. By avoiding hard-coding numbers into things like the ball radius, the catcher sizes, the font size, etc keeps a consistent user experience.

```javascript
const ctx = game.getContext('2d');
game.height = window.innerHeight * 0.75;
game.width = game.height / 1.75; //ratioed

// Event listener to dynamically resize when the window is resized
addEventListener('resize', () => {
  game.height = window.innerHeight * 0.75;
  game.width = game.height / 1.75;
});

// Constant variables
const getMiddleX = game.width / 2;
const getMiddleY = game.height / 2;
const catcherWidth = (game.width / 2) * 0.7;
const catcherHeight = game.height / 20;
const catcherXpos = (getMiddleX - catcherWidth) / 2;
const catcherYpos = game.height - catcherHeight * 2;
const avgRadius = game.height / 40;
const fontSize = game.height / 25;
const fontStyle = 'Montserrat Subrayada';

```


## THOUGHTS/REFLECTIONS

>1. One of my biggest struggles was the quadratic equations. Going back to middle-school math and then applying that knowledge to a completely different environment from the usual cartesian coordinate that we are familiar with. Since the canvas origin (0,0) coordinates exist at the top-left, trying to transform my rusty math skills to correctly apply my formulas into canvas was like trying to tie knots with noodles while asleep.
>2. It was a learning experience for me to learn how to be willing to give up on code, even when it works the way I wanted it to. I refactored the code several times in order to optimize the game logic, how certain elements behaved, etc. Sometimes I was reluctant/hesitant to change something that already worked, but since I needed the change for future improvements/better payoff - it had to be done. No regrets. (Ok some regrets from stress that I would break the whole thing into pieces, but it all worked out in the end.)
>3. I learned a lot, now I never want to look at this again.
>4. But I still think there are places where I can improve on it. Touch events for mobile would be a nice addition, and even further optimization for varying screen/monitor sizes would be great as well. There are probably also a number of things I could do to improve aesthetics and further QOL improvements.


# Random list of all the sh-super cool functions in the code.

| **CLASSES**                                | **Description**                                                      |
| ------------------------------------------ | -------------------------------------------------------------------- |
| `class Catcher`                            | Creates 2 catchers with event listeners, they change colors randomly |
| `class Fallingthings`                      | Creates falling objects at random intervals                          |
| ` class FallingthingsL` + `FallingthingsR` | Child classes of `Fallingthings`                                     |
| ` class FallingThingsMega`                 | Child class of `Fallingthings` with more different behaviors         |
| ` class Sound`                             | For BGM audio + SFX                                                  |

| **FUNCTIONS**                                                         | **Description**                                                                                                              |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `rand()`                                                              | Returns a random number, easy to use version of `Math.random()`                                                              |
| `startMessage()`, `gameOverMessage()`, `pauseMessage()`               | Text messages for different game states                                                                                      |
| `render()`                                                            | Inside the catcher + falling objects classes, renders objects on canvas                                                      |
| `changeColor()`                                                       | (Catcher class) - changes its color.                                                                                         |
| `lastPosition()`                                                      | (FallingObjects class) Saves the last position of the ball and pushes to an array to creat the motion trail                  |
| `fall()`                                                              | (FallingObjects class) calculates velocity and trajectory of fall                                                            |
| `bounceObj ()`                                                        | (FallingObjects class) Determines if the ball will bounce or not and reverses gravity                                        |
| `weightedColors()`                                                    | (FallingObjects class) Weights the randomized colors based on the catchers current color                                     |
| `collisionDetection()`                                                | (FallingObjects class) Detects if the object hit other objects and the next step of the game logic                           |
| `spawnL()`, `spawnR()`, `megaSpawn()`, `colorSwapL()`, `colorSwapR()` | Creates a new instances of the class and pushes it into the array. Sets a random timeout for the next time it will be called |
| `render()`                                                            | Not in a class, handles what's rendered on canvas at each loop                                                               |
| `upddateFallingThings()`                                              | Checks the state of each object in play and updates it to be rendered properly                                               |
| `gameLoop()`                                                          | The primary gameloop that checks game state and then renders, updates, and calls next frame to be painted                    |
| `init()`                                                              | Initializes all the starting variables based on the mode                                                                     |
| `reset()`                                                             | Resets all variables and game state                                                                                          |
| `handleKeyUp()`                                                       | Handles logic for what to do with the 'space' key event listener in different game states                                    |
