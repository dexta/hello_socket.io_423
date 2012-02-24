var io;
var clients = {};
var names = {}

var server = function() {};
server.prototype.start = function(listenServer) {
	io = require('socket.io').listen(listenServer);
	io.sockets.on('connection', function (socket) {
		socket.on('login', function (data) {
			clients[socket.id] = {};
			clients[socket.id]['username'] = data.username;
			names[data.username] = socket;
			Object.size = function(obj) {
			    var size = 0, key;
			    for (key in obj) {
			        if (obj.hasOwnProperty(key)) size++;
			    }
			    return size;
			};
			clients[socket.id]['color'] = Object.size(clients) % 5;
			
			socket.emit('login', {status:'ok', username:data.username});
			socket.broadcast.emit('message', {color:clients[socket.id]['color'], class:'joined', message:clients[socket.id]['username']  +' joined the chat'});
			
			io.sockets.emit('updateUsers', {users:clients});
			
		});
		
		//Listen to the client: Login
		socket.on('message', function (data) {
			//send data
			io.sockets.emit('message', {color:clients[socket.id]['color'], class:'line', time:getTime(), user:clients[socket.id]['username'], message: data.message});
		});
		//Listen to the privateChat client: Login
		socket.on('pmessage', function (data) {
			if(data.pcusername in names) {
				//send data only to the one
				var sockTaget = names[data.pcusername];
				sockTaget.emit('message', {color:clients[socket.id]['color'], class:'line', time:getTime(), user:clients[socket.id]['username'], message: "<b>"+data.message+"</b>"});
				}
			var sockSource = names[clients[socket.id]['username']];
			if(sockSource) {
				//send echo to the sender
				sockSource.emit('message', {color:clients[socket.id]['color'], class:'line', time:getTime(), user:clients[socket.id]['username'], message: "<i>"+data.message+"</i>"});
			}
		});
		//Listen to the client: Disconnect
		socket.on('disconnect', function () {
			if(clients[socket.id]) {
				socket.broadcast.emit('message', {color:clients[socket.id]['color'], class:'left', message:clients[socket.id]['username']  +' has left the chat'});
				delete clients[socket.id];
				//update users in chat
				io.sockets.emit('updateUsers', {users:clients});
			}
		});	
		
	});



	}
server.prototype.afterCheck = function(msgType,callBack) {
	io.sockets.on('connection', function (socket) {
			socket.on(msgType,callBack);
		});
	}

module.exports = server;

console.log('Game Chat has started');

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
