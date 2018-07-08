"use strict";

//code found on: http://darrenoneill.co.uk/post/real-time-web-apps-postgresql-and-node/

$(document).ready(function() {
	
WEB_SOCKET_SWF_LOCATION = 'inc/WebSocketMain.swf';
var socket = io.connect('http://localhost:9000');
socket.on('connected', function (data) {
    socket.emit('ready for data', {});
});
socket.on('update', function (data) {
    console.log(data.message.payload);
});



	
	
});
