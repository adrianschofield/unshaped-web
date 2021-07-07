var canvas;
var canvasContext;
//ball
var ballX = 50;
var ballY = 10;
var ballSpeedX = 4;
var ballSpeedY = 4;
var BALL_RADIUS = 10;
//bat
var paddle1X = 250;
//offset from the bottom of the play area to allow for lives and score
const PADDLEY_OFFSET = 60; 
const PADDLE_WIDTH = 100;
//blocks
var blocks = [];
var numBlockRows = 5;
var numBlockCols = 9;


const BLOCK_WIDTH = 80;
const GAP_WIDTH = 4;

//Levels and Lives
var currentLevel = 1;
var remainingLives = 5;
var showingWinScreen = false;
var gameOver = false;
var playerScore = 0;
var start = true;

//mouse handling

function calculateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x:mouseX,
		y:mouseY
	};
}

function handleMouseClick(evt) {
	if(gameOver || showingWinScreen || start) {
		playerScore = 0;
		remainingLives = 5;
		blocks.length = 0;
		ballSpeedX = 5;
		ballSpeedY = 5;
		createBlocks();
		gameOver = false;
		showingWinScreen = false;
		start = false;
	}
}

//main

window.onload = function () {
	
	var framesPerSecond = 60;
		
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	
	canvas.addEventListener('mousedown', handleMouseClick);
	canvas.addEventListener('mousemove', 
		function (evt) {
			var mousePos = calculateMousePos(evt);
			paddle1X = mousePos.x - (PADDLE_WIDTH/2);
		});
		
	createBlocks();
	ballReset();
	
	setInterval(function() {
		moveEverything();
		drawEverything();
	}, 1000/framesPerSecond);
	
		
}

//Movement and collision

function moveEverything() {
	
	if(gameOver || showingWinScreen || start) {
		return;
	}
	ballX += ballSpeedX;
	ballY += ballSpeedY;
	
	// Check if the ball hits the bounds or the bat
	if(ballX < 0){
		ballSpeedX = -ballSpeedX;
	}
	if(ballX > canvas.width){
		ballSpeedX = -ballSpeedX;
	}
	if(ballY < 0){
		ballSpeedY = -ballSpeedY;
	}
	if(ballY + BALL_RADIUS > canvas.height - PADDLEY_OFFSET){
		if(ballX > paddle1X && ballX < paddle1X + PADDLE_WIDTH) 
		{
			ballSpeedY = -ballSpeedY;
			//adjust the horizontal speed based on how close to the center of the paddle the ball is
			var deltaX = ballX - (paddle1X + (PADDLE_WIDTH / 2) );
			ballSpeedX = deltaX * 0.35;
		} else {
			remainingLives--;
			ballReset();
		}
		
	}
	//check if the ball hits a block
	checkBlockCollision();
}

function checkBlockCollision() {
	
	var numBlocksDestroyed = 0;
	for(i = 0; i < numBlockCols * numBlockRows; i++)
	{
		if(blocks[i].destroyed)
		{
			numBlocksDestroyed++;
			continue;
		} else if((((ballY - BALL_RADIUS) < (blocks[i].y + blocks[i].height)) && (ballY > blocks[i].y)) && ((ballX > blocks[i].x) && (ballX < blocks[i].x + blocks[i].width) ))
		{
			ballSpeedY = -ballSpeedY;
			blocks[i].destroyed = true;
			playerScore += 10;
			drawBlocks();
			continue;
		} else if ((((ballY + BALL_RADIUS) > (blocks[i].y)) && (ballY  < blocks[i].y + blocks[i].height)) && ((ballX > blocks[i].x) && (ballX < blocks[i].x + blocks[i].width) ))
		{
			ballSpeedY = -ballSpeedY;
			blocks[i].destroyed = true;
			playerScore += 10;
			drawBlocks();
			continue;
		} else if ((((ballX + BALL_RADIUS) > (blocks[i].x)) && (ballX < blocks[i].x + blocks[i].width)) && ((ballY > blocks[i].y) && (ballY < blocks[i].y + blocks[i].height) ))
		{
			ballSpeedX = -ballSpeedX;
			blocks[i].destroyed = true;
			playerScore += 10;
			drawBlocks();
			continue;
		}  else if ((((ballX - BALL_RADIUS) < (blocks[i].x + blocks[i].width)) && (ballX > blocks[i].x)) && ((ballY > blocks[i].y) && (ballY < blocks[i].y + blocks[i].height) ))
		{
			ballSpeedX = -ballSpeedX;
			blocks[i].destroyed = true;
			playerScore += 10;
			drawBlocks();
			continue;
		}
	}
	if(numBlocksDestroyed == (numBlockCols * numBlockRows)){
		showingWinScreen = true;
	}
	
}

//Drawing

function drawEverything() {

	if(gameOver){
		canvasContext.fillStyle = 'white';
		canvasContext.font = '50px Arial';
		canvasContext.textAlign = 'center';
		canvasContext.fillText("GAME OVER!", canvas.width / 2, 200);
	} else if (showingWinScreen){
		canvasContext.fillStyle = 'white';
		canvasContext.font = '50px Arial';
		canvasContext.textAlign = 'center';
		canvasContext.fillText("YOU WON!", canvas.width / 2, 200);
	} else if (start){
		colourRect(0, 0, canvas.width, canvas.height, 'cyan');

		canvasContext.fillStyle = 'black';
		canvasContext.font = '50px Arial';
		canvasContext.textAlign = 'center';
		canvasContext.fillText("Click to Start", canvas.width / 2, 200);
		canvasContext.fillText("Use mouse to move paddle", canvas.width / 2, 300);
	} else {
		//blank out the screen
		colourRect(0, 0, canvas.width, canvas.height, 'cyan');
		//draw the player paddle
		colourRect(paddle1X - 1, canvas.height - PADDLEY_OFFSET - 1, PADDLE_WIDTH + 2, 10 + 2, 'black');
		colourRect(paddle1X, canvas.height - PADDLEY_OFFSET, PADDLE_WIDTH, 10, 'white');
		//draw the ball
		colourCircle(ballX, ballY, BALL_RADIUS, 'red');
		//draw all the blocks
		drawBlocks();
		drawLives();
		//write score
		canvasContext.fillStyle = 'black';
		canvasContext.font = '30px Arial';
		canvasContext.textAlign = 'right';
		canvasContext.fillText(playerScore, canvas.width - 20, canvas.height - 25);
	}
	
}

function drawBlocks () {
	for(i = 0; i < numBlockCols * numBlockRows; i++) {
		if(blocks[i].destroyed) {
			continue;
		} else {
			colourRect(blocks[i].x, blocks[i].y, blocks[i].width, blocks[i].height, 'white');
			colourRect(blocks[i].x + 1, blocks[i].y + 1, blocks[i].width -2, blocks[i].height - 2, blocks[i].colour)
			//console.log(blocks[i].x);
		}
	}
}

function drawLives () {
	for(i = 0; i < remainingLives - 1; i++) {
		colourRect((i * PADDLE_WIDTH)/2 + (i * GAP_WIDTH) + 20 -1, canvas.height - 25 - 1, PADDLE_WIDTH/2 -5 + 2, 5 + 2, 'black');
		colourRect((i * PADDLE_WIDTH)/2 + (i * GAP_WIDTH) + 20 , canvas.height - 25, PADDLE_WIDTH/2 - 5, 5, 'white');
	}
}

//logic for the different level designs

function createBlocks() {
	switch (currentLevel) {
			case 1:
				for (j = 0; j < numBlockRows; j++) {
					for (i = 0; i < numBlockCols; i++) {
						blocks.push({
							x: (i * GAP_WIDTH) + (i * BLOCK_WIDTH) + 22,
							y: j * 25 + 50,
							width: BLOCK_WIDTH,
							height: 20,
							colour: 'blue',
							destroyed: false
						});
					}
				}
				break;
			default:
				break;
	}
}

//game management

function ballReset() {

	if(remainingLives == 0) {
		gameOver = true;
	}
	ballSpeedX = 5;
	ballSpeedY = 5;
	ballSpeedX = -ballSpeedX;
	// Make the new ball position betwwen -100 and +100 from the centre
	ballX = (canvas.width / 2) + getRndInteger(-100, 100);
	ballY = canvas.height / 2;
}
	

//drawing helpers

function colourCircle (centreX, centreY, radius, drawColour) {
	canvasContext.fillStyle = drawColour;
	canvasContext.beginPath();
	canvasContext.arc(centreX, centreY, radius, 0, Math.PI * 2, true);
	canvasContext.fill();
}

function colourRect(leftX, topY, width, height, drawColour) {
	canvasContext.fillStyle = drawColour;
	canvasContext.fillRect(leftX, topY, width, height);
}

//Math helpers

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}