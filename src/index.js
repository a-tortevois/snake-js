// This project is based on the @dymafr snake project
// https://github.com/dymafr/javascript-chapitre25-snake

import "./style.css";
import snakeTile from "./snakeTile";
import snakeBgSrc from "./snakeBg.png";

const snakeBg = new Image();
snakeBg.src = snakeBgSrc;

const SPEED_INIT = 800;
const SPEED_MAX = 925;

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const grid = {
    sizeX: 0,
    sizeY: 0,
    sizeElem: 0
};
let speed;
let direction;
let snake; // Coordinates of each element of our snake's body
let apple; // Coordinates of the apple
let score = 0;
let isRunning = false;

const Coordinates = (x, y) => {
    return {
        x: x,
        y: y
    }
}

const drawMap = () => {
    context.fillStyle = "rgb(150,180,0)";
    context.fillRect(0, 0, canvas.width, canvas.height);
};

const drawSnake = () => {
    let elem, nElem, pElem;
    for (let i = 0; i < snake.length; i++) {
        elem = snakeTile.blank;
        nElem = (i < snake.length) ? snake[i + 1] : null; // Next element
        pElem = (i > 0) ? snake[i - 1] : null; // Previous element
        if (i === 0) { // Head
            if (snake[i].x === 0 && nElem.x === grid.sizeX) { // Cut-Right
                elem = snakeTile.headRight;
            } else if (snake[i].y === 0 && nElem.y === grid.sizeY) { // Cut-Down
                elem = snakeTile.headDown;
            } else if (snake[i].x === grid.sizeX && nElem.x === 0) { // Cut-Left
                elem = snakeTile.headLeft;
            } else if (snake[i].y === grid.sizeY && nElem.y === 0) { // Cut-Up
                elem = snakeTile.headUp;
            } else if (snake[i].x > nElem.x) { // Uncut-Right
                elem = snakeTile.headRight;
            } else if (snake[i].y > nElem.y) { // Uncut-Down
                elem = snakeTile.headDown;
            } else if (snake[i].x < nElem.x) { // Uncut-Left
                elem = snakeTile.headLeft;
            } else if (snake[i].y < nElem.y) { // Uncut-Up
                elem = snakeTile.headUp;
            }
        } else if (i == snake.length - 1) { // Tail
            if (snake[i].x === 0 && pElem.x === grid.sizeX) { // Cut-Left
                elem = snakeTile.tailLeft;
            } else if (snake[i].y === grid.sizeY && pElem.y === 0) { // Cut-Down
                elem = snakeTile.tailDown;
            } else if (snake[i].x === grid.sizeX && pElem.x === 0) { // Cut-Right
                elem = snakeTile.tailRight;
            } else if (snake[i].y === 0 && pElem.y === grid.sizeY) { // Cut-Up
                elem = snakeTile.tailUp;
            } else if (snake[i].x < pElem.x) { // Uncut-Right
                elem = snakeTile.tailRight;
            } else if (snake[i].y < pElem.y) { // Uncut-Down
                elem = snakeTile.tailDown;
            } else if (snake[i].x > pElem.x) { // Uncut-Left
                elem = snakeTile.tailLeft;
            } else if (snake[i].y > pElem.y) { // Uncut-Up
                elem = snakeTile.tailUp;
            }
        } else { // Body
            if (snake[i].y === nElem.y && snake[i].y === pElem.y) { // Horizontal
                elem = snakeTile.bodyHorizontal;
            } else if (snake[i].x === nElem.x && snake[i].x === pElem.x) { // Vertical
                elem = snakeTile.bodyVertical;
            } else
                // Cut-Angle Top-Left
            if (snake[i].x === grid.sizeX && nElem.x === 0 && pElem.x === grid.sizeX && ((snake[i].y === nElem.y && snake[i].y === pElem.y - 1) || (snake[i].y === grid.sizeY && nElem.y === grid.sizeY && pElem.y === 0))) {
                // case 2 || case 4
                elem = snakeTile.bodyTopLeft;
            } else if (snake[i].x === grid.sizeX && nElem.x === grid.sizeX && pElem.x === 0 && ((snake[i].y === nElem.y - 1 && snake[i].y === pElem.y) || (snake[i].y === grid.sizeY && nElem.y === 0 && pElem.y === grid.sizeY))) {
                // case 6 || case 8
                elem = snakeTile.bodyTopLeft;
            } else if (snake[i].x === nElem.x - 1 && snake[i].x === pElem.x && snake[i].y === grid.sizeY && nElem.y === grid.sizeY && pElem.y === 0) {
                // case 3
                elem = snakeTile.bodyTopLeft;
            } else if (snake[i].x === nElem.x && snake[i].x === pElem.x - 1 && snake[i].y === grid.sizeY && nElem.y === 0 && pElem.y === grid.sizeY) {
                // case 7
                elem = snakeTile.bodyTopLeft;
            } else
                // Cut-Angle Top-Right
            if (snake[i].x === 0 && nElem.x === grid.sizeX && pElem.x === 0 && ((snake[i].y === nElem.y && snake[i].y === pElem.y - 1) || (snake[i].y === grid.sizeY && nElem.y === grid.sizeY && pElem.y === 0))) {
                // case 2 || case 4
                elem = snakeTile.bodyTopRight;
            } else if (snake[i].x === 0 && nElem.x === 0 && pElem.x === grid.sizeX && ((snake[i].y === nElem.y - 1 && snake[i].y === pElem.y) || (snake[i].y === grid.sizeY && nElem.y === 0 && pElem.y === grid.sizeY))) {
                // case 6 || case 8
                elem = snakeTile.bodyTopRight;
            } else if (snake[i].x === nElem.x + 1 && snake[i].x === pElem.x && snake[i].y === grid.sizeY && nElem.y === grid.sizeY && pElem.y === 0) {
                // case 3
                elem = snakeTile.bodyTopRight;
            } else if (snake[i].x === nElem.x && snake[i].x === pElem.x + 1 && snake[i].y === grid.sizeY && nElem.y === 0 && pElem.y === grid.sizeY) {
                // case 7
                elem = snakeTile.bodyTopRight;
            } else
                // Cut-Angle Down-Right
            if (snake[i].x === 0 && nElem.x === grid.sizeX && pElem.x === 0 && ((snake[i].y === nElem.y && snake[i].y === pElem.y + 1) || (snake[i].y === 0 && nElem.y === 0 && pElem.y === grid.sizeY))) {
                // case 2 || case 4
                elem = snakeTile.bodyDownRight;
            } else if (snake[i].x === 0 && nElem.x === 0 && pElem.x === grid.sizeX && ((snake[i].y === nElem.y + 1 && snake[i].y === pElem.y) || (snake[i].y === 0 && nElem.y === grid.sizeY && pElem.y === 0))) {
                // case 6 || case 8
                elem = snakeTile.bodyDownRight;
            } else if (snake[i].x === nElem.x + 1 && snake[i].x === pElem.x && snake[i].y === 0 && nElem.y === 0 && pElem.y === grid.sizeY) {
                // case 3
                elem = snakeTile.bodyDownRight;
            } else if (snake[i].x === nElem.x && snake[i].x === pElem.x + 1 && snake[i].y === 0 && nElem.y === grid.sizeY && pElem.y === 0) {
                // case 7
                elem = snakeTile.bodyDownRight;
            } else
                // Cut-AngleLeft-Down
            if (snake[i].x === grid.sizeX && nElem.x === 0 && pElem.x === grid.sizeX && ((snake[i].y === nElem.y && snake[i].y === pElem.y + 1) || (snake[i].y === 0 && nElem.y === 0 && pElem.y === grid.sizeY))) {
                // case 2 || case 4
                elem = snakeTile.bodyLeftDown;
            } else if (snake[i].x === grid.sizeX && nElem.x === grid.sizeX && pElem.x === 0 && ((snake[i].y === nElem.y + 1 && snake[i].y === pElem.y) || (snake[i].y === 0 && nElem.y === grid.sizeY && pElem.y === 0))) {
                // case 6 || case 8
                elem = snakeTile.bodyLeftDown;
            } else if (snake[i].x === nElem.x - 1 && snake[i].x === pElem.x && snake[i].y === 0 && nElem.y === 0 && pElem.y === grid.sizeY) {
                // case 3
                elem = snakeTile.bodyLeftDown;
            } else if (snake[i].x === nElem.x && snake[i].x === pElem.x - 1 && snake[i].y === 0 && nElem.y === grid.sizeY && pElem.y === 0) {
                // case 7
                elem = snakeTile.bodyLeftDown;
            } else if ((snake[i].x < nElem.x && snake[i].y < pElem.y) // Uncut-Angle Top-Left
                || (snake[i].x < pElem.x && snake[i].y < nElem.y)
            ) {
                elem = snakeTile.bodyTopLeft;
            } else if ((snake[i].x > nElem.x && snake[i].y < pElem.y) // Uncut-Angle Top-Right
                || (snake[i].x > pElem.x && snake[i].y < nElem.y)
            ) {
                elem = snakeTile.bodyTopRight;
            } else if ((snake[i].x > nElem.x && snake[i].y > pElem.y) // Uncut-Angle Down-Right
                || (snake[i].x > pElem.x && snake[i].y > nElem.y)
            ) {
                elem = snakeTile.bodyDownRight;
            } else if ((snake[i].x < nElem.x && snake[i].y > pElem.y) // Uncut-Angle Left-Down
                || (snake[i].x < pElem.x && snake[i].y > nElem.y)
            ) {
                elem = snakeTile.bodyLeftDown;
            }
        }
        // Draw the image of the snake part
        context.drawImage(snakeTile.image, elem.x * snakeTile.size, elem.y * snakeTile.size, snakeTile.size, snakeTile.size, snake[i].x * grid.sizeElem, snake[i].y * grid.sizeElem, grid.sizeElem, grid.sizeElem);
    }
};

const drawApple = () => {
    // Draw the apple image
    context.drawImage(snakeTile.image, snakeTile.apple.x * snakeTile.size, snakeTile.apple.y * snakeTile.size, snakeTile.size, snakeTile.size, apple.x * grid.sizeElem, apple.y * grid.sizeElem, grid.sizeElem, grid.sizeElem);
};

window.addEventListener("resize", () => {
    resizeGame();
});

window.addEventListener("click", () => {
    if (!isRunning) {
        isRunning = true;
        if (isGameOver()) {
            startGame();
        }
        requestAnimationFrame(updateGame);
    } else {
        isRunning = false;
    }
});

window.addEventListener("keydown", event => {
    switch (event.code) {
        case "ArrowRight": {
            if (direction !== "left") direction = "right";
            break;
        }
        case "ArrowLeft": {
            if (direction !== "right") direction = "left";
            break;
        }
        case "ArrowUp": {
            if (direction !== "down") direction = "up";
            break;
        }
        case "ArrowDown": {
            if (direction !== "up") direction = "down";
            break;
        }
        case "Space": {
            if (!isRunning) {
                isRunning = true;
                if (isGameOver()) {
                    startGame();
                }
                requestAnimationFrame(updateGame);
            } else {
                isRunning = false;
            }
            break;
        }
        default: {
        }
    }
});

const isGameOver = () => {
    if (!snake) return false;
    const [head, ...body] = snake;
    for (let elem of body) {
        if (elem.x === head.x && elem.y === head.y) {
            return true;
        }
    }
    return false;
};

const generateApple = () => {
    const [x, y] = [
        Math.trunc(Math.random() * (canvas.width / grid.sizeElem)),
        Math.trunc(Math.random() * (canvas.height / grid.sizeElem))
    ];
    for (let body of snake) {
        if (body.x === x && body.y === y) {
            return generateApple();
        }
    }
    apple = new Coordinates(x, y);
};

const generateSnake = () => {
    const maxX = canvas.width / grid.sizeElem - 5;
    const minX = 3;
    const maxY = canvas.height / grid.sizeElem - 5;
    const minY = 5;
    const randomX = Math.floor(Math.random() * (maxX - minX)) + minX;
    const randomY = Math.floor(Math.random() * (maxY - minY)) + minY
    const head = new Coordinates(randomX, randomY);
    snake.push(head, new Coordinates(head.x - 1, head.y), new Coordinates(head.x - 2, head.y));
    direction = ["right", "up", "down"][Math.trunc(Math.random() * 3)];
};

const updateSnakePosition = () => {
    let head, coord;
    switch (direction) {
        case "right": {
            coord = (snake[0].x + 1 <= grid.sizeX) ? snake[0].x + 1 : 0;
            head = new Coordinates(coord, snake[0].y);
            break;
        }
        case "left": {
            coord = (snake[0].x - 1 >= 0) ? snake[0].x - 1 : grid.sizeX;
            head = new Coordinates(coord, snake[0].y);
            break;
        }
        case "up": {
            coord = (snake[0].y - 1 >= 0) ? snake[0].y - 1 : grid.sizeY;
            head = new Coordinates(snake[0].x, coord);
            break;
        }
        case "down": {
            coord = (snake[0].y + 1 <= grid.sizeY) ? snake[0].y + 1 : 0;
            head = new Coordinates(snake[0].x, coord);
            break;
        }
        default: {
        }
    }
    snake.unshift(head);
    if (head.x === apple.x && head.y === apple.y) {
        score++;
        if (speed <= SPEED_MAX) speed += 5;
        generateApple();
    } else {
        snake.pop();
    }
};

const drawSnakeBackground = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "rgb(150,180,0)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    const posX = Math.round(canvas.width * 0.7);
    const posY = snakeBg.height / (snakeBg.width / (canvas.width - posX));
    context.drawImage(snakeBg, 0, 0, snakeBg.width, snakeBg.height, posX - 20, canvas.height - posY - 20, canvas.width * 0.3, posY);
}

const drawScore = () => {
    context.fillStyle = "black";
    context.font = "40px sans-serif";
    context.textBaseline = "top";
    context.fillText(score, grid.sizeElem, grid.sizeElem);
};

const drawStarGame = () => {
    drawSnakeBackground();
    context.font = "40px sans-serif";
    context.fillStyle = "black";
    context.textBaseline = "middle";
    context.textAlign = "center";
    context.fillText(
        "Press the spacebar to start the game",
        canvas.width / 2,
        canvas.height / 2
    );
}

const drawGameOver = () => {
    drawSnakeBackground();
    context.font = "40px sans-serif";
    context.fillStyle = "black";
    context.textBaseline = "middle";
    context.textAlign = "center";
    context.fillText(
        "Game Over !",
        canvas.width / 2,
        canvas.height / 2
    );
    context.fillText(
        `Your score: ${score}`,
        (canvas.width / 2),
        (canvas.height / 2) + 40
    );
}

const updateGame = () => {
    if (isRunning) {
        updateSnakePosition();
        if (!isGameOver()) {
            drawMap();
            drawSnake();
            drawApple();
            drawScore();
            setTimeout(() => {
                requestAnimationFrame(updateGame);
            }, 1000 - speed);
        } else {
            drawGameOver();
            isRunning = false;
        }
    }
};

const startGame = () => {
    score = 0;
    snake = [];
    speed = SPEED_INIT;
    drawStarGame();
    generateApple();
    generateSnake();
};

const resizeGame = () => {
    /**
     if (window.innerWidth < 576) {
    grid.sizeElem = 20;
  } else if (window.innerWidth < 768) {
    grid.sizeElem = 25;
  } else if (window.innerWidth < 992) {
    grid.sizeElem = 30;
  } else if (window.innerWidth < 992) {
    grid.sizeElem = 35;
  } else if (window.innerWidth < 1200) {
    grid.sizeElem = 40;
  } else if (window.innerWidth >= 1200) {
    grid.sizeElem = 45;
  }
     canvas.width = Math.floor((window.innerWidth - 2) / grid.sizeElem) * grid.sizeElem;
     canvas.height = Math.floor((window.innerHeight - 2) / grid.sizeElem) * grid.sizeElem;
     /**/
    grid.sizeElem = 30;
    canvas.width = 750;
    canvas.height = 600;
    grid.sizeX = canvas.width / grid.sizeElem - 1;
    grid.sizeY = canvas.height / grid.sizeElem - 1;
    startGame();
};

snakeBg.addEventListener('load', () => {
    resizeGame();
});
