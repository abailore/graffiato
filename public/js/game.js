
var canvas,			// Canvas DOM element
	ctx,			// Canvas rendering context
	keys,			// Keyboard input
	localPlayer,
	remotePlayers,
	socket;	// Local player


function init() {
	// Declare the canvas and rendering context
	canvas = document.getElementById("gameCanvas");
	ctx = canvas.getContext("2d");

	// Maximise the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// Initialise keyboard controls
	keys = new Keys();

	// Calculate a random start position for the local player
	// The minus 5 (half a player size) stops the player being
	// placed right on the egde of the screen
	var startX = Math.round(Math.random()*(canvas.width-5)),
		startY = Math.round(Math.random()*(canvas.height-5));

	var strokeColor = get_random_color();

	// Initialise the local player
	localPlayer = new Player(startX, startY, strokeColor);

	socket = io.connect("http://localhost", {port: 8000, transports: ["websocket"]});

	remotePlayers = [];

	// Start listening for events
	setEventHandlers();
};

function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    console.log(color);
    return color;
}


var setEventHandlers = function() {
	// Keyboard
	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", onKeyup, false);

	// Window resize
	window.addEventListener("resize", onResize, false);

	socket.on("connect", onSocketConnected);
	socket.on("disconnect", onSocketDisconnect);
	socket.on("new player", onNewPlayer);
	socket.on("move player", onMovePlayer);
	socket.on("remove player", onRemovePlayer);
};

// Keyboard key down
function onKeydown(e) {
	if (localPlayer) {
		keys.onKeyDown(e);
	};
};

// Keyboard key up
function onKeyup(e) {
	if (localPlayer) {
		keys.onKeyUp(e);
	};
};

// Browser window resize
function onResize(e) {
	// Maximise the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

function onSocketConnected() {
	console.log("Connected to socket server");
	socket.emit("new player", {x: localPlayer.getX(), y: localPlayer.getY(), color: localPlayer.getColor()});
};

function onSocketDisconnect() {
	console.log("Disconnected from socket server");
};

function onNewPlayer(data) {
	console.log("New player connected: "+data.id);
	var newPlayer = new Player(data.x, data.y, data.color);
	newPlayer.id = data.id;
	remotePlayers.push(newPlayer);
};

function onMovePlayer(data) {
	var movePlayer = playerById(data.id);

	if(!movePlayer) {
		console.log("Player not found: "+data.id);
		return;
	}

	movePlayer.setPrevX(movePlayer.getX());
	movePlayer.setPrevY(movePlayer.getY());

	movePlayer.setX(data.x);
	movePlayer.setY(data.y);
};

function onRemovePlayer(data) {
	var removePlayer = playerById(data.id);

	if(!removePlayer) {
		console.log("Player not found: "+data.id);
		return;
	}

	remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
};


function animate() {
	update();
	draw();

	// Request a new animation frame using Paul Irish's shim
	window.requestAnimFrame(animate);
};


function update() {
	if(localPlayer.update(keys)) {
		socket.emit("move player", {x: localPlayer.getX(), 
									y: localPlayer.getY()});
	}
};


function draw() {
	// Wipe the canvas clean
	//ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Draw the local player
	localPlayer.draw(ctx, localPlayer.getColor());

	var i;
	for(i=0; i < remotePlayers.length; i++) {
		remotePlayers[i].draw(ctx, remotePlayers[i].getColor());
	};
};

function playerById(id) {
	var i;
	for(i=0; i < remotePlayers.length; i++) {
		if (remotePlayers[i].id == id) {
			return remotePlayers[i];
		}
	}

	return false;
}