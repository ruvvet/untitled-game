# untitled.game(idk)

No that's actually the name.

## Catch the falling balls with the bar of the matching color.

Inspired by all the catcher games 🌠. The twist is that they change colors all the time. 🔴🟠🟡🟢🔵🟣🟤⚫⚪
The bars, the balls, spawn points, and trajectory are random.

### Modes:

- 😝 Easy (you get 2 random colors, more lives, and odds are weighted in your favor)
- 😭 Hard-ish (there's 5 colors to deal with and less chances)

## How to play 🎮

>1. Go to [livesite](https://ruvvet.github.io).
>2. Catch the falling balls that match the color of the bar w/ the `f` & `j` keys.
>3. Successfully catching a matching ball nets your +1 point.
>4. Failing to catch a matching ball costs -1 life.
>5. Beat your own high score, the more points you get, the more balls that spawn.
>6. The game is over when you lose all your lives.

### Screenshots

![ss](https://github.com/ruvvet/untitled-game/blob/main/img/Screenshot_1.png)
![ss](https://github.com/ruvvet/untitled-game/blob/main/img/game.gif)

# Code snippets

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


### Travel path, collision detection, render logic, motion trails, and more.

Functions for behavior and game logic for individual elements/instances are calculated using functions inside the parent/child classes.

```javascript
    //...

// creates the motion trail for the falling ball
lastPosition(x, y) {
    // called after the object is moved to a new position
    // saves it in the motion trail array
    // deletes the first element to constantly update
    this.motionTrailArr.push({ x: x, y: y });
    if (this.motionTrailArr.length > this.motionTrailLength) {
      this.motionTrailArr.shift();
    }
  }

// dictates how it will fall and react with other objects
fall(timeMultiplier) {
    this.lastPosition(this.x, this.y);
    this.speedY += this.gravity * timeMultiplier;
    this.y += this.speedY + this.gravitySpeed;
    // determines the trajectory at which objects will fall
    this.x +=
      this.direction *
      Math.sqrt((this.y - game.height) / -this.slope) *
      timeMultiplier;
    // determines if the ball will bounce
      this.bounceObj();
    }
    // determines if the ball continue to be rendered
    if (this.y > game.height || this.x > game.width || this.x < 0) {
      hit.play();
      this.keeprendering = false;
    }
  }

```

### Using setTimeout to simulate random events

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

### Primary game loop

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
| **CLASSES**       | **Description**                                                     |
| --------------- | --------------------------------------------------------------- |
| `class Catcher`  | Creates 2 catchers with event listeners, they change colors randomly |
| `class Fallingthings` | Creates falling objects at random intervals   |
| ` class FallingthingsL` + `FallingthingsR` | Child classes of `Fallingthings` |
| ` class FallingThingsMega` | Child class of `Fallingthings` with more different behaviors |
| ` class Sound` | For BGM audio + SFX |


| **FUNCTIONS**       | **Description**                                                     |
| --------------- | --------------------------------------------------------------- |
| `rand()`          | Returns a random number, easy to use version of `Math.random()`   |
| `startMessage()`, `gameOverMessage()`, `pauseMessage()`   | Text messages for different game states   |
| `render()`  | Inside the catcher + falling objects classes, renders objects on canvas |
| `changeColor()`   | (Catcher class) - changes its color. |
| `lastPosition()`     | (FallingObjects class) Saves the last position of the ball and pushes to an array to creat the motion trail  |
| `fall()` | (FallingObjects class) calculates velocity and trajectory of fall |
| `bounceObj ()` | (FallingObjects class) Determines if the ball will bounce or not and reverses gravity|
| `weightedColors()` | (FallingObjects class) Weights the randomized colors based on the catchers current color|
| `collisionDetection()` | (FallingObjects class) Detects if the object hit other objects and the next step of the game logic |
| `spawnL()`, `spawnR()`, `megaSpawn()`, `colorSwapL()`, `colorSwapR()` | Creates a new instances of the class and pushes it into the array. Sets a random timeout for the next time it will be called |
| `render()` | Not in a class, handles what's rendered on canvas at each loop|
| `upddateFallingThings()`| Checks the state of each object in play and updates it to be rendered properly|
| `gameLoop()`| The primary gameloop that checks game state and then renders, updates, and calls next frame to be painted|
|`init()`| Initializes all the starting variables based on the mode|
|`reset()`| Resets all variables and game state|
|`handleKeyUp()` | Handles logic for what to do with the 'space' key event listener in different game states|



