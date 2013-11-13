var Player = function(startX, startY, color) {
	var x = startX,
		y = startY,
		strokeColor = color,
		id;

	var getX = function() {
		return x;
	};

	var getY = function() {
		return y;
	};

	var setX = function(newX) {
		x = newX;
	};

	var setY = function(newY) {
		y = newY;
	};

	var getColor = function() {
		return strokeColor;
	};

	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		getColor: getColor,
		id: id
	}
};

exports.Player = Player;