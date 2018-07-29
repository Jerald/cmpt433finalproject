"use strict";

const express = require('express');
const fs   = require('fs');
const http = require('http');
const path = require('path');

const { Client } = require('pg')

const SERVER_PORT = 8088;
const server = express();

const API_KEY = "otgY8vs1oqo2wXKYoiNY";
const PLOTLY_USERNAME = "boat";
var plotly = require('plotly')(PLOTLY_USERNAME, API_KEY);
var plotUrl = "";

// PostgreSQL database stuff
const psqlClient = new Client({
    user: 'admin_433',
    host: '127.0.0.1',
    database: 'vending_machine'
});

psqlClient.connect();


// Helper functions

function fileGetFunc(fileName, contentType)
{
    return (req, res) => res.sendFile(fileName, {root: __dirname, headers: {"Content-Type": contentType}});
}

function getGraph(res)
{
    var data = [{x:[0,1,2], y:[3,2,1], type: 'bar'}];
    var layout = {fileopt : "overwrite", filename : "simple-node-example"};

    plotly.plot(data, layout, function (err, msg)
    {
        if (err) return console.log(err);

        var url = msg.url;
        var start = url.indexOf('//');
        var suburl = url.slice(start);	
        var newsrc = suburl.concat(".embed");        
        
        plotUrl = newsrc;
        console.log(`Sending plot with url: ${plotUrl}`);
        res.json({src: plotUrl});
    });
}

// Server routing functions
server.get("/style.css", fileGetFunc("style.css", "text/css"));
server.get("/script.js", fileGetFunc("script.js", "application/js"));

server.get("/", function (req, res)
{
    console.log("Sending index.html...");
    res.sendFile("/index.html", {root: __dirname});
    console.log("Sent index.html");
});

server.post("/getGraph", function (req, res)
{
    // We had a bunch of stupid shit to get this to work right,
    // And then I remembered this works...
    getGraph(res);
});

server.listen(SERVER_PORT, function ()
{
    console.log("Server listening on port " + SERVER_PORT);
});

//tcpServer.listen(server2);
