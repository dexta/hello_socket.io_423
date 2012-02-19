//setup server
var srvport = 9090;//process.env.PORT;
var ambience = 'http://127.0.0.1:'+srvport;//'http://hello_socket_io_423.dexta.c9.io';

var express = require('express');
var app = express.createServer();
var io = require('socket.io').listen(app);
app.listen(srvport);
//create an object to hande and identify clients
var clients = {};

app.configure(function(){
    app.set('views','views');
    app.set('view engine','jade');
    app.set('view options', { pretty: true });
});

app.use(express.static(__dirname + '/static'));	
console.log('Try Static '+ __dirname);

app.get('/chat/:pa', function (req, res) {
	res.render('index.jade', {port: srvport,host: ambience});
	});

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
