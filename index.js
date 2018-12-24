// Import packages
const express = require("express");
const socketIO = require("socket.io");
const path = require("path");

// Configuration
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

// Start server
const server = express()
	.use((req, res) => res.sendFile(INDEX) )
	.listen(PORT, () => console.log("Listening on https://wowface.herokuapp.com/:" + PORT));

// Initiatlize SocketIO
const io = socketIO(server);



// Register "connection" events to the WebSocket
io.on('connection', function(socket) {
	var channel;
	
	socket.on('join', function (ch) {
		channel = ch;
		console.log('user connected => ' + channel);
		
		socket.join(channel);
		
		// https://socket.io/docs/emit-cheatsheet/
		io.to(channel).emit('start', channel);
		//socket.emit('start', channel);
		
		//io.emit('hello', channel);
	});
	
	
	
	socket.on('score', function(value){
		socket.to(channel).emit('score', value);
		//io.emit('score', value);
	});
});