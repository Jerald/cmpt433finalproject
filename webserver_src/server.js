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
    password: 'teambato',
    host: '127.0.0.1',
    database: 'vending_machine'
});
psqlClient.connect();

function getPopTableUpdate(res)
{
    var updateObj = {
        button1: {},
        button2: {},
        button3: {},
        button4: {},
        button5: {},
        button6: {},
        button7: {},
        button8: {}
    };
    
    var respondedQueries = 0;

    // Iterate through each of the 8 columns and get their count data
    for (var i = 1; i <= 8; i++)
    {
        updateObj[`button${i}`] = { count: undefined };
     
        psqlClient.query(`SELECT count FROM drinks WHERE col_num = ${i-1};`, function (err, response)
        {
            if (err)
            {
                console.log(`Error in database query for button ${i}\nError is: ${err}`);
                res.end(500);
                return;
            }

            console.log(`Query for button ${i} has response: ${response}`);
            updateObj[`button${i}`].count = response;
            respondedQueries += 1;

            // When all 8 queries have been responded, send the data
            if (respondedQueries == 8)
            {
                console.log("Sending pop table update");
                res.json(updateObj);
            }
        });
    }
}

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
        if (err)
        {
            console.log(`Plotly plot error: ${err}`);
            res.end(500);
            return;
        }    

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

server.post("/getPopTableUpdate", function (req, res)
{
    getPopTableUpdate(res);
});

server.listen(SERVER_PORT, function ()
{
    console.log("Server listening on port " + SERVER_PORT);
});

//tcpServer.listen(server2);
