const getImg = name => `asssets/img/${name}`;

const startGameEl = document.getElementById('start-game');

//listeners
document.addEventListener('keydown', keyPush);

//canvas
const canvas = document.querySelector('canvas');
const title = document.querySelector('h2');

const ctx = canvas.getContext('2d');

//game
let gameIsRunning = true;
let gameStarted = false;

let fps = 5;
const tileSize = 50;
const tileCountX = canvas.width / tileSize;
const tileCountY = canvas.height / tileSize;

let score = 0;

//player
let snakeSpeed = tileSize;
let snakePosX = 0;
let snakePosY = canvas.height / 2;

let velocityX = 1;
let velocityY = 0;

let tail = [];
let snakeLength = 3;

//head pic
const head = new Image();
head.src = getImg('snake-face.png');

const epl = new Image();
epl.src = getImg('epl.png');

//food
let foodPosX = 0;
let foodPosY = 0;


//loop
function gameLoop() {
    if (gameIsRunning) {
        moveStuff();
        drawStuff();
        setTimeout(gameLoop, 1000 / fps);
    }
}

function startGame() {
    startGameEl.style.display = 'none';
    document.getElementById('game').style.display = 'block';
    resetFood();
    gameLoop();
}

//move dat snake
function moveStuff() {
    snakePosX += snakeSpeed * velocityX;
    snakePosY += snakeSpeed * velocityY;

    //wall collisions
    if (snakePosX === canvas.width) {
        gameOver();
    }

    if (snakePosX === -tileSize) {
        gameOver();
    }

    if (snakePosY === canvas.height) {
        gameOver();
    }

    if (snakePosY === -tileSize) {
        gameOver();
    }

    //game over
    tail.forEach((snakePart) => {
        if (snakePosX === snakePart.x && snakePosY === snakePart.y) {
            gameOver();
        }
    });

    // tail
    tail.push({
        x: snakePosX,
        y: snakePosY
    });

    //forget earlist
    tail = tail.slice(-1 * snakeLength);

    // food collision
    if (snakePosX === foodPosX && snakePosY === foodPosY) {
        title.textContent = ++score;
        snakeLength++;
        if (fps < 10) {
            fps += 0.3;
        }
        resetFood();
    }
}

//draw shit
function drawStuff() {
    if (gameIsRunning) {
        //bcg
        rectangle("#00db96", 0, 0, canvas.width, canvas.height);

        //grid
        drawGrid();

        //foood
        ctx.drawImage(epl, foodPosX + 10, foodPosY + 10, tileSize - 20, tileSize - 20);

        //tail
        tail.forEach((snakePart, index) => {
            if (index != tail.length - 1) {
                vircle("#bada55", snakePart.x, snakePart.y, tileSize / 2, true)
            }
        })

        // snake head
        ctx.drawImage(head, snakePosX - 10, snakePosY - 10, tileSize + 20, tileSize + 20);
    }
}

//draw rect
function rectangle(color, x, y, width, height) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function vircle(color, x, y, r, center = false) {
    const vircle = new Path2D();
    vircle.arc(x + (center ? r : 0), y + (center ? r : 0), r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill(vircle);
}

//draw grid
function drawGrid() {
    for (let i = 0; i < tileCountX; i++) {
        for (let j = 0; j < tileCountY; j++) {
            rectangle(
                "#dadada",
                tileSize * i,
                tileSize * j,
                tileSize - 1,
                tileSize - 1
            );
        }
    }
}

//randomize food
function resetFood() {
    //gameover nowhere to gooo
    if (snakeLength === tileCountX * tileCountY) {
        gameOver();
    }

    foodPosX = Math.floor(Math.random() * tileCountX) * tileSize;
    foodPosY = Math.floor(Math.random() * tileCountY) * tileSize;

    //food on ma head
    if (snakePosX === foodPosX && snakePosY === foodPosY) {
        resetFood();
    }
    //food on ma body
    if (tail.some((snakePart) => snakePart.x === foodPosX && snakePart.y === foodPosY)) {
        resetFood();
    }
}

//gameover
function gameOver() {
    title.innerHTML = `☠️ <strong> ${score} </strong> ☠️`;
    gameIsRunning = false;
}

//keys
function keyPush(event) {
    if (event.keyCode == 32 && !gameStarted) {
        kanter();
    } else {
        switch (event.key) {
            case "ArrowLeft":
                if (velocityX !== 1) {
                    velocityX = -1;
                    velocityY = 0;
                }
                break;
            case "ArrowUp":
                if (velocityY !== 1) {
                    velocityX = 0;
                    velocityY = -1;
                }
                break;
            case "ArrowRight":
                if (velocityX !== -1) {
                    velocityX = 1;
                    velocityY = 0;
                }
                break;
            case "ArrowDown":
                if (velocityY !== 1) {
                    velocityX = 0;
                    velocityY = 1;
                }
                break;
            default:
                //restart
                if (!gameIsRunning) location.reload();
                break;
        }
    }
}

const kanter = () => {
    gameStarted = true;
    let counter = 3;
    const kanDano = () => {
        if (counter == 0) {
            startGame();
        } else {
            startGameEl.innerHTML = `<div class="counter">${counter--}</div>`;
            setTimeout(kanDano, 1000);
        }
    };

    kanDano();
}

startGameEl.addEventListener('click', kanter);