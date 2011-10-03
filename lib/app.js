//setup server
var app = require('express').createServer();
var io = require('socket.io').listen(app);
app.listen(9090);

//create an object to hande and identify clients
var clients = {};


//check for connection
io.sockets.on('connection', function (socket) {

	//Listen to the client: Login
	socket.on('login', function (data) {
	
		//save usernames
		clients[socket.id] = {};
		clients[socket.id]['username'] = data.username;
		
		//set a color
		Object.size = function(obj) {
		    var size = 0, key;
		    for (key in obj) {
		        if (obj.hasOwnProperty(key)) size++;
		    }
		    return size;
		};
		clients[socket.id]['color'] = Object.size(clients) % 5;
		
		//send data
		socket.emit('login', {status:'ok', username:data.username});
		socket.broadcast.emit('message', {color:clients[socket.id]['color'], class:'joined', message:clients[socket.id]['username']  +' joined the chat'});
		
		//update users in chat
		io.sockets.emit('updateUsers', {users:clients});
		
	});
	
	//Listen to the client: Login
	socket.on('message', function (data) {
		//send data
		io.sockets.emit('message', {color:clients[socket.id]['color'], class:'line', time:getTime(), user:clients[socket.id]['username'], message: data.message});
	});
	
	//Listen to the client: Disconnect
	socket.on('disconnect', function () {
		socket.broadcast.emit('message', {color:clients[socket.id]['color'], class:'left', message:clients[socket.id]['username']  +' has left the chat'});
		delete clients[socket.id];
		
		//update users in chat
		io.sockets.emit('updateUsers', {users:clients});
	});	
	
});



function getTime() {
    var dTime = new Date();
    var hours = dTime.getHours();
    var minute = dTime.getMinutes();
    
    if(hours < 10) {
      hours = "0" + hours;
    }
    
    if(minute < 10) {
      minute = "0" + minute;
    }
    return hours + ":" + minute;
}
