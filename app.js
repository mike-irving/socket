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
	.listen(PORT, () => console.log("Listening on :" + PORT));

// Initiatlize SocketIO
const io = socketIO(server);



// Register "connection" events to the WebSocket
// https://socket.io/docs/emit-cheatsheet/

io.on('connection', function(socket) {
	var channel;
	
	socket.on('disconnect', function () {
		//io.in(channel).emit('disconnected');
	});
	
	socket.on('join', function (opts) {
		channel = opts.channel;
		//console.log('user connected => ' + channel);
		
		socket.join(channel, function(){
			//console.log('join', socket.rooms, socket.client);
			var clients = io.sockets.adapter.rooms[channel];
			
			var length = clients.length;
			console.log(clients, clients.length);
			
			
			io.to(channel).emit('hello', {channel:channel, mobi:opts.mobi, userCount: length});
			
			if(length >=2 ) {
				io.to(channel).emit('start'); // emit to all users on channel
			}
			
			//socket.broadcast.emit('start', channel); // emit to all users on channel
		});
		
		
		
		
		
		
		//socket.to(channel).emit('start', channel); // emit to others
	});
	
	
	
	socket.on('score', function(value){
		socket.to(channel).emit('score', value);
		//io.emit('score', value);
	});
});

