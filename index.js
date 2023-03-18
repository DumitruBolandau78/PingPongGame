'use strict'

let canvas,
    contextCanvas,
    ballX = 10,
    ballSpeedX = 5,
    ballSpeedY = 2,
    ballY = 10,
    paddle1Y = 250,
    paddle2Y = 250,

    player1Score = 0,
    player2Score = 0,
    showingWinScreen = false;

const PADDLE_HEIGHT = 100,
    PADDLE_THICKNESS = 10,
    WINNING_SCORE = 3;

function calculateMousePosition(event) {
    let rect = canvas.getBoundingClientRect(),
        root = document.documentElement,
        mouseX = event.clientX - rect.left - root.scrollLeft,
        mouseY = event.clientY - rect.top - root.scrollTop;

    return {
        x: mouseX,
        y: mouseY
    }
}

window.addEventListener('load', () => {

    canvas = document.getElementById('canvas'),
        contextCanvas = canvas.getContext('2d'),
        contextCanvas.font = '30px serif';

    const framesPerSecond = 100;

    setInterval(callBoth, 1000 / framesPerSecond);

    canvas.addEventListener('mousedown', handleMouseClick);

    canvas.addEventListener('mousemove', e => {
        let mousePos = calculateMousePosition(e);
        paddle1Y = mousePos.y - (PADDLE_HEIGHT / 2);
    });

});

function handleMouseClick() {
    if (showingWinScreen) {
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
    }
}

function computerMovement() {

    let paddle2YCenter = paddle2Y + (PADDLE_HEIGHT / 2);

    if (paddle2YCenter < ballY - 35) {
        paddle2Y += 6;
    } else if (paddle2YCenter > ballY + 35) {
        paddle2Y -= 6;
    }
}

function callBoth() {
    moveEverything();
    drawEverything();
}

function moveEverything() {

    computerMovement();

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY < 0) {
        ballSpeedY = -(ballSpeedY);
    }

    if (ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    if (ballX < 0) {
        if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
            ballSpeedX = -(ballSpeedX);

            let deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
            ballSpeedY = deltaY * 0.15;
        } else {
            player2Score++;
            ballReset();
        }
    }

    if (ballX > canvas.width) {
        if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;
        } else {
            player1Score++;
            ballReset();
        }
    }
}

function colorRect(leftX, topY, width, height, drawColor) {
    contextCanvas.fillStyle = drawColor;
    contextCanvas.fillRect(leftX, topY, width, height);
}

function colorCircle(centerX, centerY, radius, drawColor) {
    contextCanvas.fillStyle = drawColor;
    contextCanvas.beginPath();
    contextCanvas.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    contextCanvas.fill();
}

function ballReset() {
    if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
        showingWinScreen = true;
    }
    ballSpeedX = -(ballSpeedX);
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

function drawNet() {
    for (let i = 0; i < canvas.width; i += 40) {
        colorRect(canvas.width / 2 - 1, i, 2, 20, 'white');
    }
}

function drawEverything() {

    colorRect(0, 0, canvas.width, canvas.height, 'black');

    if (showingWinScreen) {
        contextCanvas.fillStyle = 'white';
        if (player1Score >= WINNING_SCORE) {
            contextCanvas.fillText('left player won', canvas.width / 2 - 100, canvas.height / 2 - 100);
        } else if (player2Score >= WINNING_SCORE) {
            contextCanvas.fillText('right player won', canvas.width / 2 - 100, canvas.height / 2 - 100);
        }
        contextCanvas.fillStyle = 'white';
        contextCanvas.fillText('click to continue', canvas.width / 2 - 100, canvas.height / 2);
        return;
    }

    drawNet();

    colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
    colorRect(canvas.width - PADDLE_THICKNESS, paddle2Y, 10, PADDLE_HEIGHT, 'white');
    colorCircle(ballX, ballY, 7, 'white');

    contextCanvas.fillText(player1Score, 100, 100);
    contextCanvas.fillText(player2Score, canvas.width - 100, 100);
}