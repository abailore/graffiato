
var Player = function(startX, startY, color) {
	var x = startX,
		y = startY,
		prevX = startX,
		prevY = startY,
		id,
		moveAmount = 2,
		strokeColor = color;

	var getX = function() {
		return x;
	};

	var getY = function() {
		return y;
	};

	var setPrevX = function(x) {
		prevX = x;
	};

	var setPrevY = function(y) {
		prevY = y;
	};

	var setX = function(newX) {
		//prevX = x;
		x = newX;
	};

	var setY = function(newY) {
		//prevY = y;
		y = newY;
	};

	var getColor = function() {
		return strokeColor;
	};

	var update = function(keys) {
		prevX = x;
		prevY = y;
		// Up key takes priority over down
		if (keys.up) {
			y -= moveAmount;
		} else if (keys.down) {
			y += moveAmount;
		};

		// Left key takes priority over right
		if (keys.left) {
			x -= moveAmount;
		} else if (keys.right) {
			x += moveAmount;
		};
		return (prevX != x || prevY != y) ? true : false;
	};

	var draw = function(ctx) {
		//ctx.fillRect(x-5, y-5, 10, 10);
		ctx.strokeStyle = this.getColor();

		ctx.moveTo(prevX,prevY);
		ctx.lineTo(x,y);
		ctx.stroke();
	};

	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		setPrevX: setPrevX,
		setPrevY: setPrevY,
		update: update,
		getColor: getColor,
		draw: draw
	}
};