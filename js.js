 $(document).ready(function() {
 	$('#chatwindow').hide();
 
 	//Focus field to enter username
 	$('#username').focus();
 	
 	//When the form to set the username is submitted...
 	$('#setUsernameForm').submit(function() {
 	
 		//... get the username
 		if($('#username').val() == ''){
 			alert('Please enter a username.');	
 		}else{
 			//if username is fine, send it to the server to start chat
 			socket.emit('login', {username:$('#username').val()});
 		}//if
 		
 		return false;
 		
 	});
 	
 	
 	//send a message
 	$('#sendMessageForm').submit(function() {
 	
 		//... get the message
 		message = $('#message').val();
 		message = message.replace(/<\/?[^>]+(>|$)/g, "");
 		if(message != ''){
 			
 			socket.emit('message', {message:message});
 		}//if
 		
 		return false;
 		
 	});
 	 
 }); //document.ready
 


//Connect to the server
var socket = io.connect('http://localhost:9090'); 
 
 //Listen to the server: Login
socket.on('login', function (data) {
	if(data.status == 'ok'){
		$('#login').remove();
		$('#chatwindow').show();
		$('#messages ul').prepend('<li class="welcome">Welcome to the chat, '+ data.username +'</li>');
		$('#message').focus();
	}//if
 });
  
//Listen to the server: Messages
socket.on('message', function (data) {
	 extras = '';
	 if(data.time){extras = '<span class="time">'+ data.time +'</span><span class="user">'+ data.user +':</span>';}
	 $('<li class="color'+ data.color +' ' + data.class + '">'+ extras + data.message +'</li>').hide().prependTo('#messages ul').slideDown('fast');
	 $('#message').val('');
	 
	 //cut off oldest messages
	 if($('#messages ul').children().size() > 50){
	 	$('#messages ul li:last-child').remove();
	 }//if
	 
});

//Listen to the server: Update user
socket.on('updateUsers', function (data) {
	$('#names ul').empty();
	$.each(data.users, function(key, value) {
		$('#names ul').append('<li class="color'+ value.color +'">' + value.username + '</li>');
	});	 
});
