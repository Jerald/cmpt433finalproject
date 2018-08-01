"use strict";

const express = require('express');
const fs   = require('fs');
const http = require('http');
const path = require('path');

const { Client } = require('pg')

const SERVER_PORT = 8088;
const server = express();

const API_KEY = "6Zn0UN6Uzcwdes3BuiOu";
const PLOTLY_USERNAME = "Jeraldson";
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


function getGraphDataPoints(res)
{	
	console.log(res);
	var button1 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var button2 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var button3 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var button4 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var button5 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var button6 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var button7 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var button8 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var buttons = [button1, button2, button3, button4, button5, button6, button7, button8];
	
	//var date = "2018-07-29"; //temporary
	//if no work, change second DD to ZZ and replace YYYY-MM-ZZ with Date + 1
	var defQuery = "SELECT col_num, EXTRACT(HOUR FROM purchase_date) AS HOUR_START, count(EXTRACT(HOUR FROM purchase_date)) FROM purchases WHERE purchase_date BETWEEN '2018-07-29 00:00:00' AND '2018-07-30 00:00:00' group by HOUR_START, col_num order by col_num, HOUR_START asc";
	//var newquery = defQuery.replace("YYYY-MM-DD", date);
	
	//console.log(newquery);
	//console.log(defQuery);
	psqlClient.query(defQuery, function (err, response)
	{
		console.log(response.rows);
        if (err)
        {
            console.log(`Error in database query for buttons\nError is: ${err}`);
            res.end();
            return;
        }
        else if (response.rows === undefined || response.rows.length == 0) 
		{
			console.log("query returned no rows\n");
			res.end();
			return;
		}
     
        var dbrow = 0;  //if only one row returned, the row is dbrow0 and is of length 1
        var numRows = response.rows.length;
        for(var i = 0; i <= 7; i++) //each col_n
        {
        	if(dbrow ==  numRows)
        	{
        		console.log("dbrow matches numRows: " + dbrow);
        		break;
        	}
        	
        	for(var j = 0; j <= 23; j++)//24 hours
        	{
        		if(dbrow == numRows)
        		{
        			console.log("dbrow matches numRows: " + dbrow);
        			break;
        		}
        		
        		if(response.rows[dbrow].col_num != i)//on to next column
        		{
        			break;
        		}
        		else if(response.rows[dbrow].hour_start != j) //on to next hour
        		{
        			continue;
        		}
        		else
        		{
      
        			if(i == 0)
        			{
        				button1[j] = response.rows[dbrow].count;  
        			}
        			else if(i == 1)
        			{
        				button2[j] = response.rows[dbrow].count; 
        			}
        			else if(i == 2)
        			{
        				button3[j] = response.rows[dbrow].count; 
        			}
        			else if(i == 3)
        			{
        				button4[j] = response.rows[dbrow].count; 
        			}
        			else if(i == 4)
        			{
        				button5[j] = response.rows[dbrow].count; 
        			}
        			else if(i == 5)
        			{
        				button6[j] = response.rows[dbrow].count; 
        			}
        			else if(i == 6)
        			{
        				button7[j] = response.rows[dbrow].count; 
        			}
        			else if(i == 7)
        			{
        				button8[j] = response.rows[dbrow].count; 	
        			}
        			dbrow++;
        		}
        	}	
        }
        res.json(buttons);
        res.end(); 
    });
}

function getPopTableUpdate(res)
{
    	var updateObj = {
        button1: { count: 0},
        button2: { count: 0},
        button3: { count: 0},
        button4: { count: 0},
        button5: { count: 0},
        button6: { count: 0},
        button7: { count: 0},
        button8: { count: 0}
    };
    
    var respondedQueries = 0;

    // Iterate through each of the 8 columns and get their count data
    for (var i = 1; i <= 8; i++)
    {
    	//console.log("I value: " + i);
    	var index = i;
        ((index) => psqlClient.query(`SELECT count FROM drinks WHERE col_num = ${i-1};`, function (err, response)
        {
        	//console.log("Index in callback: " + index);
            if (err)
            {
                console.log(`Error in database query for button ${index}\nError is: ${err}`);
                res.end();
                return;
            }

            //console.log(`Query for button ${index} has response: ${JSON.stringify(response)}`);
            //console.log(updateObj);
            updateObj[`button${index}`].count = response.rows[0].count;
            respondedQueries += 1;

            // When all 8 queries have been responded, send the data
            if (respondedQueries == 8)
            {
                //console.log("Sending pop table update");
                res.json(updateObj);
                res.end()
            }
        }))(index);
    }
}

// Helper functions

function fileGetFunc(fileName, contentType)
{
    return (req, res) => res.sendFile(fileName, {root: __dirname, headers: {"Content-Type": contentType}});
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
	console.log("req" + req);
	console.log("res" + res);
	getGraphDataPoints(res);
	
});

server.post("/getPopTableUpdate", function (req, res)
{
    getPopTableUpdate(res);
});

server.listen(SERVER_PORT, function ()
{
    console.log("Server listening on port " + SERVER_PORT);
});
