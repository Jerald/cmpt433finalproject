var express = require('express');
var http = require('http');
var fs   = require('fs');
var path = require('path');
var udpServer = require('./lib/udp_server');

var PORT_NUMBER = 8088;
var app = module.exports.app = express();

var server = http.createServer(app);
app.use(express.static('public'));
app.get('/', function(req,res){
	res.sendFile(path.join(__dirname + '/public/index.html'));
})

server.listen(PORT_NUMBER, function() {
	console.log("Server listeneing on port " + PORT_NUMBER);
});

udpServer.listen(server);
