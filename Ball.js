function Ball()
{
	var x,y,w,h;
	var speed, pathSlope;
	var prevX, prevY;
	var imageIndex;

	this.init = initializer;
	this.ballMovement = moveBall;
	this.ballMoveCancel = moveCancel;
	this.reflectHorizontally = horizontalReflect;
	this.refectVertically = verticalReflect;

	this.getX = xGetter;
	this.getY = yGetter;
	this.getPrevX = prevXGetter;
	this.getPrevY = prevYGetter;
	this.getW = wGetter;
	this.getH = hGetter;
	this.getImageIndex = imageIndexGetter;
	
	function initializer(_x, _y, _w, _h, _speed, _pathSlope, _imageIndex)
	{
		x = _x;
		y = _y;
		prevX = x;
		prevY = y;
		w = _w;
		h = _h;
		speed = _speed;
		pathSlope = _pathSlope;
		imageIndex = _imageIndex;
	}

	function moveBall(timeElapsed)
	{
		prevX = x;
		prevY = y;
		var distance = (timeElapsed / 1000) * speed;
		var dx = distance * Math.cos(pathSlope * (3.14 / 180));
		var dy = distance * Math.sin(pathSlope * (3.14 / 180));
		x = parseFloat(x) + parseFloat(dx);
		y = parseFloat(y) - parseFloat(dy);
	}

	function moveCancel()
	{
		x = prevX;
		y = prevY;
	}

	function verticalReflect()
	{
		pathSlope = -pathSlope;
	}

	function horizontalReflect()
	{
		pathSlope = 180 - pathSlope;
	}

	function xGetter()
	{
		return x;
	}

	function yGetter()
	{
		return y;
	}
	
	function prevXGetter()
	{
		return prevX;
	}

	function prevYGetter()
	{
		return prevY;
	}
	
	function wGetter()
	{
		return w;
	}
	
	function hGetter()
	{
		return h;
	}

	function imageIndexGetter()
	{
		return imageIndex;
	}
}