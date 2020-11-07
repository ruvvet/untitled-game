# untitled.game(idk)

No that's actually the name.

## Catch the falling balls with the bar of the matching color.

Inspired by all the catcher games 🌠. The twist is that they change colors all the time. 🔴🟠🟡🟢🔵🟣🟤⚫⚪
The bars, the balls, spawn points, and trajectory are random.

### Modes:

- 😝 Easy (you get 2 random colors, more lives, and odds are weighted in your favor)
- 😭 Hard-ish (there's 5 colors to deal with and less chances)

## How to play 🎮

1. Go to [livesite](https://ruvvet.github.io).
2. Catch the falling balls that match the color of the bar w/ the `f` & `j` keys.
3. Successfully catching a matching ball nets your +1 point.
4. Failing to catch a matching ball costs -1 life.
5. Beat your own high score, the more points you get, the more balls that spawn.
6. The game is over when you lose all your lives.

### Screenshots

![alt text](https://github.com/ruvvet/untitled-game/blob/main/img/Screenshot_1.png)

# Code snippets

### Creating classes for major objects, such as the falling balls/objects

The constructor that controls all the behavior and qualities of each falling ball.

```javascript
class Fallingthings {
  //need an extended class
  constructor(colorweight) {
    // random spawn location
    this.x = rand(game.width / 4, (game.width / 4) * 3);
    this.y = rand(0, game.height / 8);
    // initializes random color
    this.color = colors[rand(0, colors.length)];
    this.speedX = 0;
    this.speedY = 0;
    this.spawnX = this.x;
    this.spawnY = this.y;
    // initializes random trajectory that will fall in range of the bar
    this.slope = Math.random() * (0.3 - 0.15) + 0.15;
    this.gravity = 0.5;
    this.gravitySpeed = 0;
    this.direction = 1;
    this.bounce = 1;
    this.radius = avgRadius;
    this.match = false;
    // controls if the ball is still in play or not
    this.alive = true;
    // controls if the ball was successfully caught
    this.caught = false;
    // controls if the ball is kept rendering even if 'dead'
    this.keeprendering = true;
    this.colorweight = colorweight;

    this.motionTrailArr = [];
    this.motionTrailLength = 30;
  }

  //...

```

### Travel path, collision detection, render logic, motion trails, and more.

Functions for all these are handled inside the parent class.

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

### Extending the falling objects class to create objects w/ different behaviors

The falling objects parent class was extended into 3 children classes: objects that fall from the left, objects that fall from the right, and the mega balls which are there to wreak havok.

```javascript
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

### Update loop

```javascript

```

### Main game loop w/ requestanimationframe
```javascript

```







| Functions       | Description                                                     |
| --------------- | --------------------------------------------------------------- |
| `...`  | ...    |


| -Some- Variables | Description                                                      |
| ---------------- | ---------------------------------------------------------------- |
| `...`        | ...                                     |
 |
