const CELL_SIZE = 20;
const CANVAS_SIZE = 600;
//made faster
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
//this
const DIRECTION = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3,
};
var MOVE_INTERVAL = 120;

function initPosition() {
  return {
    x: Math.floor(Math.random() * WIDTH),
    y: Math.floor(Math.random() * HEIGHT),
  };
}

function initDirection() {
  return Math.floor(Math.random() * 4);
}

let snake1 = {
  color: "red",
  position: initPosition(),
  direction: initDirection(),
  score: 0,
  level: 1,
  life: 3,
};

let obstacles = {
  color: "pink",
  position: initPosition(),
};

let apple1 = {
  position: initPosition(),
};
let apple2 = {
  position: initPosition(),
};

let life1 = {
  position: initPosition(),
};

function drawCell(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawScore(snake) {
  let scoreCanvas;
  scoreCanvas = document.getElementById("score1Board");

  let scoreCtx = scoreCanvas.getContext("2d");

  scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  scoreCtx.font = "30px Arial";
  scoreCtx.fillStyle = snake.color;
  scoreCtx.fillText(snake.score, 10, scoreCanvas.scrollHeight / 2);
}

function drawLevel(snake) {
  let levelCanvas;
  if (snake.color == snake1.color) {
    scoreCanvas = document.getElementById("level1Board");
  } else {
    scoreCanvas = document.getElementById("level2Board");
  }
  let scoreCtx = scoreCanvas.getContext("2d");

  scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  scoreCtx.font = "30px Arial";
  scoreCtx.fillStyle = snake.color;
  scoreCtx.fillText("level " + snake.level, 10, scoreCanvas.scrollHeight / 2);
}

function drawSnake(ctx, snake) {
  let snakeImage = new Image();
  snakeImage.src = "./assets/snake.png";
  ctx.drawImage(
    snakeImage,
    snake.position.x * CELL_SIZE,
    snake.position.y * CELL_SIZE,
    CELL_SIZE,
    CELL_SIZE
  );
}

function drawLife(ctx, life) {
  let lifeImage = new Image();
  lifeImage.src = "./assets/life.png";
  ctx.drawImage(
    lifeImage,
    life.position.x * CELL_SIZE,
    life.position.y * CELL_SIZE,
    CELL_SIZE,
    CELL_SIZE
  );
}

function drawApple(ctx, apple) {
  let food = new Image();
  food.src = "./assets/apple.png";
  ctx.drawImage(
    food,
    apple.position.x * CELL_SIZE,
    apple.position.y * CELL_SIZE,
    CELL_SIZE,
    CELL_SIZE
  );
}

function isPrime(num) {
  for (let i = 2, s = Math.sqrt(num); i <= s; i++)
    if (num % i === 0) return false;
  return num > 1;
}

function draw() {
  setInterval(function () {
    let snakeCanvas = document.getElementById("snakeBoard");
    let ctx = snakeCanvas.getContext("2d");

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    drawSnake(ctx, snake1);
    drawCell(ctx, obstacles.position.x, obstacles.position.y, obstacles.color);

    drawScore(snake1);
    drawLevel(snake1);

    drawApple(ctx, apple1);
    drawApple(ctx, apple2);

    if (isPrime(snake1.score)) {
      drawLife(ctx, life1);
    }

    let live = new Image();
    live.src = "./assets/live.png";
    let lifeBoard = document.getElementById("lifeBoard");
    let lifeCtx = lifeBoard.getContext("2d");
    // for (let i = 0; i < snake1.life; i++) {
    //   lifeCtx.drawImage(
    //     live,
    //     i * CELL_SIZE + 40,
    //     CELL_SIZE,
    //     CELL_SIZE,
    //     CELL_SIZE
    //   );
    // }
    lifeCtx.font = "24px Arial";
    lifeCtx.fillText("live " + snake1.life, CELL_SIZE + 40, CELL_SIZE);
  }, REDRAW_INTERVAL);
}

function teleport(snake) {
  if (snake.position.x < 0) {
    snake.position.x = CANVAS_SIZE / CELL_SIZE - 1;
  }
  if (snake.position.x >= WIDTH) {
    snake.position.x = 0;
  }
  if (snake.position.y < 0) {
    snake.position.y = CANVAS_SIZE / CELL_SIZE - 1;
  }
  if (snake.position.y >= HEIGHT) {
    snake.position.y = 0;
  }
}

function levelUpSound() {
  var audio = new Audio("./assets/levelup.mp3");
  audio.play();
}
function gameOverSound() {
  var audio = new Audio("./assets/game-over-sound-effect.mp3");
  audio.play();
}

function eat(snake, apple1, apple2) {
  if (
    snake.position.x == apple1.position.x &&
    snake.position.y == apple1.position.y
  ) {
    apple1.position = initPosition();
    snake.score++;
    if (snake.score % 5 === 0) {
      snake.level++;
    }
    if (snake.level === 5) {
      alert("Congratz");
    }
    if (snake.level === 0 || snake.live === 0) {
      gameOverSound();
      alert("Game Over");
    }
    for (let i = 0; i < 5; i++) {
      if (snake.level == i) {
        MOVE_INTERVAL -= 1;
        levelUpSound();
      }
    }
  }

  if (
    snake.position.x == apple2.position.x &&
    snake.position.y == apple2.position.y
  ) {
    apple2.position = initPosition();
    snake.score++;
  }

  if (
    snake.position.x == obstacles.position.x &&
    snake.position.y == obstacles.position.y
  ) {
    obstacles.position = initPosition();
    if (snake.score > 0) {
      snake.score--;
    }
    snake.life--;
  }

  if (
    snake.position.x == life1.position.x &&
    snake.position.y == life1.position.y
  ) {
    life1.position = initPosition();
    snake.life++;
  }
}

function moveLeft(snake) {
  snake.position.x--;
  teleport(snake);
  eat(snake, apple1, apple2);
}

function moveRight(snake) {
  snake.position.x++;
  teleport(snake);
  eat(snake, apple1, apple2);
}

function moveDown(snake) {
  snake.position.y++;
  teleport(snake);
  eat(snake, apple1, apple2);
}

function moveUp(snake) {
  snake.position.y--;
  teleport(snake);
  eat(snake, apple1, apple2);
}

function move(snake) {
  switch (snake.direction) {
    case DIRECTION.LEFT:
      moveLeft(snake);
      break;
    case DIRECTION.RIGHT:
      moveRight(snake);
      break;
    case DIRECTION.DOWN:
      moveDown(snake);
      break;
    case DIRECTION.UP:
      moveUp(snake);
      break;
  }
  setTimeout(function () {
    move(snake);
  }, MOVE_INTERVAL);
}

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft") {
    snake1.direction = DIRECTION.LEFT;
  } else if (event.key === "ArrowRight") {
    snake1.direction = DIRECTION.RIGHT;
  } else if (event.key === "ArrowUp") {
    snake1.direction = DIRECTION.UP;
  } else if (event.key === "ArrowDown") {
    snake1.direction = DIRECTION.DOWN;
  }
});

function initGame() {
  move(snake1);
}
initGame();
