const getImg = name => `asssets/img/${name}`;

const startGameEl = document.getElementById('start-game');

const audio = document.getElementById('nyanya');
const ublublbubl = document.getElementById('ublublbubl');
audio.playbackRate = 0.7;
audio.currentTime = 1;
audio.volume = 0.5;
ublublbubl.playbackRate = 2;

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
            audio.playbackRate += 0.03;
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
    audioStop();
    ublublbubl.play(); //tulic was here
    title.innerHTML = `☠️ <strong> ${score} </strong> ☠️`;
    gameIsRunning = false;
}

const turnLeft = () => {
    if (velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    }
}

const turnUp = () => {
    if (velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    }
}

const turnRight = () => {
    if (velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

const turnDown = () => {
    if (velocityY !== 1) {
        velocityX = 0;
        velocityY = 1;
    }
}

document.addEventListener('touchstart', handleTouchStart, false);        
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;                                                        
var yDown = null;

function getTouches(evt) {
  return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
}                                                     

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;                                      
};                                                

function handleTouchMove(evt) {
    evt.preventDefault();
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            turnLeft();
        } else {
            turnRight();
        }                       
    } else {
        if ( yDiff > 0 ) {
            turnUp(); 
        } else { 
            turnDown();
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;                                             
};

//keys
function keyPush(event) {
    if (event.keyCode == 32 && !gameStarted) {
        kanter();
    } else {
        switch (event.key) {
            case "ArrowLeft":
               turnLeft();
                break;
            case "ArrowUp":
                turnUp();
                break;
            case "ArrowRight":
               turnRight();
                break;
            case "ArrowDown":
                turnDown();
                break;
            default:
                //restart
                if (!gameIsRunning) location.reload();
                break;
        }
    }
}

const audioStart = () => {
    audio.play();
}
const audioStop = () => {
    audio.pause();
}

const kanter = () => {
    gameStarted = true;
    let counter = 3;
    audioStart();
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