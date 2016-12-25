function Game()
{
	var lastTime;
	
	var ballObj;
	var paddleObj;
	var allBricks;
	
	//HARDIK: CODE RELATED TO GAME-OVER----------------------
	var setIntervalID;
	var isGameOver;
	//-------------------------------------------------------
	
	this.init = initializer;
	
	function initializer()
	{
		//initializations
		ballObj = new Ball();
		ballObj.init(BALL_INIT_X, BALL_INIT_Y, allImages[BALL_IMG].width, allImages[BALL_IMG].height, INIT_BALL_SPEED, INIT_BALL_DIRECTION, BALL_IMG);
		
		paddleObj = new Paddle();
		paddleObj.init(PADDLE_INIT_X, PADDLE_INIT_Y, allImages[PADDLE_IMG].width, allImages[PADDLE_IMG].height, PADDLE_IMG);
		
		allBricks = new Array();
		var brickX, brickY;
		var brickCounter = 0;
		var i, j;
		var brickW = allImages[BRICK_ORANGE_IMG].width;
		var brickH = allImages[BRICK_ORANGE_IMG].height;
		brickX = BRICKS_INIT_X;
		brickY = BRICKS_INIT_Y;
		for(i = 0; i < 5; i++)
		{
			for(j = 0; j < 5; j++)
			{
				allBricks[brickCounter] = new Brick();
				if(i == 4)
				{
					//For the last row, we will have all bricks as Blue
					allBricks[brickCounter].init(brickX, brickY, brickW, brickH, BRICK_BLUE);
				}
				else
				{
					//For rows 0 to 3, all bricks will be Orange
					allBricks[brickCounter].init(brickX, brickY, brickW, brickH, BRICK_ORANGE);	
				}
				brickX = parseFloat(brickX) + parseFloat(brickW) + parseFloat(BRICKS_HGAP);
				brickCounter++;
			}
			brickY = parseFloat(brickY) + parseFloat(brickH) + parseFloat(BRICKS_VGAP);
			brickX = BRICKS_INIT_X;
		}
		
		lastTime = new Date().getTime();
		
		//HARDIK: CODE RELATED TO GAME-OVER----------------------
		//Calling setInterval returns an ID. This ID can then be used whenever we need to clearInterval. 
		//Thus, we can call clearInterval(setIntervalID); to stop the gameLoop.
		setIntervalID = setInterval(gameLoop, 10);
		//SETTING IS-GAME-OVER AS FALSE INITIALLY
		isGameOver = false;
		//-------------------------------------------------------
	}
	
	function gameLoop()
	{
		update();
		draw();
	}
	
	function update()
	{
		//HARDIK: CODE RELATED TO GAME-OVER----------------------
		//IF isGameOver is true,
		//NEED TO CLEAR INTERVAL AS GAME GETS OVER NOW.
		//SO WE USE SET-INTERVAL-ID RETURNED BY setInterval TO call clearInterval
		if(isGameOver)
		{
			clearInterval(setIntervalID);
			return;
		}
		//-------------------------------------------------------
		
		var currTime = new Date().getTime();
		var timeElapsed = currTime - lastTime;
		lastTime = currTime;
		
		//process events
		if(inputManager.isLeftPressed())
			paddleObj.moveLeft();
		
		if(inputManager.isRightPressed())
			paddleObj.moveRight();
		
		//update ball movement
		ballObj.ballMovement(timeElapsed);
		
		//Check Bounds
		if(ballObj.getX() < 0 || ballObj.getX() > 500 - ballObj.getW())
		{
			ballObj.reflectHorizontally();
			ballObj.ballMoveCancel();
		}
		
		if(ballObj.getY() < 0 || ballObj.getY() > 500 - ballObj.getW())
		{
			ballObj.refectVertically();
			ballObj.ballMoveCancel();
		}
		
		//HARDIK: CODE RELATED TO GAME-OVER----------------------
		//CHECKING IF BALL'S Y POSITION IS GREATER THAN PADDLE'S BOTTOM EDGE (PADDLE_Y + PADDLE_HEIGHT)
		if(ballObj.getY() > paddleObj.getY() + paddleObj.getH())
		{
			//SETTING IS-GAME-OVER AS TRUE
			isGameOver = true;
		}
		//--------------------------------------------------------
		
		//Collision with Paddle
		if(checkCollision(ballObj, paddleObj))
		{
			var prevXOfBall = ballObj.getPrevX();
			var prevYOfBall = ballObj.getPrevY();
			var ballWidth = ballObj.getW();
			var ballRight = parseFloat(ballObj.getX()) + parseFloat(ballWidth);
			var ballBottom = parseFloat(ballObj.getY()) + parseFloat(ballWidth);
			var paddleRight = parseFloat(paddleObj.getX()) + parseFloat(paddleObj.getW());
			var paddleBottom = parseFloat(paddleObj.getY()) + parseFloat(paddleObj.getH());
			
			//Check from Left
			if(parseFloat(prevXOfBall) + parseFloat(ballWidth) < paddleObj.getX() && ballRight >= paddleObj.getX())
			{
				//consoleOut("Left");
				ballObj.reflectHorizontally();
				ballObj.ballMoveCancel();
			}
			
			//Check from Top
			if(parseFloat(prevYOfBall) + parseFloat(ballWidth) < paddleObj.getY() && ballBottom >= paddleObj.getY())
			{
				//consoleOut("Top");
				ballObj.refectVertically();
				ballObj.ballMoveCancel();
			}
			
			//Check from Right
			if(prevXOfBall > paddleRight && paddleRight >= ballObj.getX())
			{
				//consoleOut("Right");
				ballObj.reflectHorizontally();
				ballObj.ballMoveCancel();
			}
			
			//Check from Bottom
			if(prevYOfBall > paddleBottom && paddleBottom >= ballObj.getY())
			{
				//consoleOut("Right");
				ballObj.refectVertically();
				ballObj.ballMoveCancel();
			}
		}
		
		//Collision with Bricks
		var b;
		var brickObj;
		for(b = 0; b < allBricks.length; b++)
		{
			brickObj = allBricks[b];
			if(brickObj.getBrickType() == BRICK_DESTROYED)
				continue;
			
			if(checkCollision(ballObj, brickObj))
			{
				var prevXOfBall = ballObj.getPrevX();
				var prevYOfBall = ballObj.getPrevY();
				var ballWidth = ballObj.getW();
				var ballRight = parseFloat(ballObj.getX()) + parseFloat(ballWidth);
				var ballBottom = parseFloat(ballObj.getY()) + parseFloat(ballWidth);
				var brickRight = parseFloat(brickObj.getX()) + parseFloat(brickObj.getW());
				var brickBottom = parseFloat(brickObj.getY()) + parseFloat(brickObj.getH());
				
				//Check from Left
				if(parseFloat(prevXOfBall) + parseFloat(ballWidth) < brickObj.getX() && ballRight >= brickObj.getX())
				{
					//consoleOut("Left");
					ballObj.reflectHorizontally();
					ballObj.ballMoveCancel();
				}
				
				//Check from Top
				if(parseFloat(prevYOfBall) + parseFloat(ballWidth) < brickObj.getY() && ballBottom >= brickObj.getY())
				{
					//consoleOut("Top");
					ballObj.refectVertically();
					ballObj.ballMoveCancel();
				}
				
				//Check from Right
				if(prevXOfBall > brickRight && brickRight >= ballObj.getX())
				{
					//consoleOut("Right");
					ballObj.reflectHorizontally();
					ballObj.ballMoveCancel();
				}
				
				//Check from Bottom
				if(prevYOfBall > brickBottom && brickBottom >= ballObj.getY())
				{
					//consoleOut("Right");
					ballObj.refectVertically();
					ballObj.ballMoveCancel();
				}
				
				brickObj.registerHit();
			}
		}
	}
	
	function draw()
	{
		//HARDIK: CODE RELATED TO GAME-OVER----------------------
		//IF isGameOver is true,
		//DRAW GAME-OVER-IMAGE & return
		if(isGameOver)
		{
			ctx.drawImage(allImages[GAME_OVER_IMG], 0, 0);
			return;
		}
		//-------------------------------------------------------
		
		//clear the canvas
		ctx.clearRect(0,0,500,500);
		
		//draw Background
		ctx.drawImage(allImages[GAME_BG], 0, 0);

		//draw Ball
		ctx.drawImage(allImages[ballObj.getImageIndex()], ballObj.getX(), ballObj.getY());

		//draw Paddle
		ctx.drawImage(allImages[paddleObj.getImageIndex()], paddleObj.getX(), paddleObj.getY());
		
		//draw Bricks
		var b;
		var brickObj;
		for(b = 0; b < allBricks.length; b++)
		{
			brickObj = allBricks[b];
			switch(brickObj.getBrickType())
			{
				case BRICK_ORANGE:
					
					ctx.drawImage(allImages[BRICK_ORANGE_IMG], brickObj.getX(), brickObj.getY());
					break;
				case BRICK_BLUE:
					ctx.drawImage(allImages[BRICK_BLUE_IMG], brickObj.getX(), brickObj.getY());
					break;
				case BRICK_GRAY:
					ctx.drawImage(allImages[BRICK_GRAY_IMG], brickObj.getX(), brickObj.getY());
					break;
			}
		}
	}
	
	function checkCollision(obj1, obj2)
	{
		var bottom1 = parseFloat(obj1.getY()) + parseFloat(obj1.getH());
		var right1 = parseFloat(obj1.getX()) + parseFloat(obj1.getW());
		var bottom2 = parseFloat(obj2.getY()) + parseFloat(obj2.getH());
		var right2 = parseFloat(obj2.getX()) + parseFloat(obj2.getW());
		
		if (bottom1 < obj2.getY())
			return false;
		
		if (obj1.getY() > bottom2)
			return false;
			
		if (right1 < obj2.getX())
			return false;
		
		if (obj1.getX() > right2)
			return false;
			
		return true;
	}
}