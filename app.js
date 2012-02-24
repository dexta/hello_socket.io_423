//setup server
var srvport = 9090;//process.env.PORT;
var ambience = 'http://127.0.0.1:'+srvport;//'http://hello_socket_io_423.dexta.c9.io';

var express = require('express');
var app = express.createServer();
var chat = require('./gameChat').server(app);
app.listen(srvport);
//create an object to hande and identify clients


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

