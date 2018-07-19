"use strict";

const express = require('express');
const fs   = require('fs');

const SERVER_PORT = 8088;
const server = express();

// Helper functions
function fileGetFunc(fileName, contentType)
{
    return (req, res) =>
        res.sendFile(fileName, {root: __dirname, headers: {"Content-Type": contentType}});
}

// Server routing functions
server.get("/style.css", fileGetFunc("style.css", "text/css"));
server.get("/script.js", fileGetFunc("script.js", "application/js"));

server.get("/", function (req, res)
{
    fileGetFunc("index.html", "text/html");
});

server.listen(PORT_NUMBER, function ()
{
	console.log("Server listeneing on port " + PORT_NUMBER);
});

