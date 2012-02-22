 $(document).ready(function() {
 	//alert("Das ist jQuery !!");
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
 		// match /w username message
		isprivat = message.match(/^\/w\s([a-zA-Z0-9]+)\s(.*)/);
 		if(isprivat !== null) {
			socket.emit('pmessage', {message:isprivat[2],pcusername:isprivat[1]});
		} else if(message != ''){
 			socket.emit('message', {message:message});
 		}//if
 		return false;
 		
 	});
 	// code from http://jsbin.com/ufuqo/24/edit
 	var resize = false;
	var chat_height = $("#gobalChatWindow").height();
		
	$(document).mouseup(function(event) {
		resize = false;
		chat_height = $("#gobalChatWindow").height();
	});
	$("#resize").mousedown(function(event) {
		resize = event.pageY;
	});
	$(document).mousemove(function(event) {
		if (resize) {
			if (chat_height + resize - event.pageY < 84) {
				$("#gobalChatWindow").height(84);
			} else if (chat_height + resize - event.pageY > 541) {
				$("#gobalChatWindow").height(541);
			} else {
				$("#gobalChatWindow").height(chat_height + resize - event.pageY);
			}
		}
	}); //mousemove
 								// end import code from jsbin
 }); //document.ready

//Connect to the server
var socket = io.connect(host); 
 
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
