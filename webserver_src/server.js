"use strict";

const express = require('express');
const fs   = require('fs');
const http = require('http');
const path = require('path');

const SERVER_PORT = 8088;
const server = express();
const API_KEY = "otgY8vs1oqo2wXKYoiNY";
const PLOTLY_USERNAME = "boat";
var plotly = require('plotly')(PLOTLY_USERNAME, API_KEY);
//var app = module.exports.app = express();
//var server2 = http.createServer(app);
//var tcpServer = require('./lib/tcp_server');

// Helper functions

function fileGetFunc(fileName, contentType)
{
    return (req, res) =>
        res.sendFile(fileName, {root: __dirname, headers: {"Content-Type": contentType}});
}


function displayGraph()
{
	var data = [{x:[0,1,2], y:[3,2,1], type: 'bar'}];
	var layout = {fileopt : "overwrite", filename : "simple-node-example"};
	var url = '';
	plotly.plot(data, layout, function (err, msg) {
		if (err) return console.log(err);
		//console.log(msg);
		//JSON.stringify(msg);
		//console.log(msg);
		//console.log(msg.url);
		//console.log(JSON.stringify(msg));
		url = msg.url;
		var start = url.indexOf('//');
		var suburl = url.slice(start);	
		var newsrc = suburl.concat(".embed");
		
		$('#graph').attr('src', newsrc);
		//$('#graph').attr('width', 800);
		//$('#graph').attr('height', 900);
		$('#graph').attr('hidden', false);
		
		
		//width:0; height:0; border:0; border:none"
		console.log(newsrc);
		
	});
}

// Server routing functions
//server.get("/style.css", fileGetFunc("style.css", "text/css"));
server.get("/script.js", fileGetFunc("script.js", "application/js"));

server.get("/", function (req, res)
{
    //fileGetFunc("/index.html", "text/html");
	res.sendFile(path.join(__dirname + '/index.html'));
	displayGraph();	
});

server.listen(SERVER_PORT, function ()
{
	console.log("Server listeneing on port " + SERVER_PORT);
});

//tcpServer.listen(server2);
