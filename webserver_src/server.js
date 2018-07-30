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


function makeButtonGraphs(res)
{
	var hour_starts = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,29,20,21,22,23];
	var button1 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var button2 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var button3 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var button4 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var button5 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var button6 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var button7 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var button8 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	
	//var date = "2018-07-29"; //temporary
	//if no work, change second DD to ZZ and replace YYYY-MM-ZZ with Date + 1
	var defQuery = "SELECT col_num, EXTRACT(HOUR FROM purchase_date) AS HOUR_START, count(EXTRACT(HOUR FROM purchase_date)) FROM purchases WHERE purchase_date BETWEEN '2018-07-30 00:00:00' AND '2018-07-31 00:00:00' group by HOUR_START, col_num order by col_num, HOUR_START asc";
	//var newquery = defQuery.replace("YYYY-MM-DD", date);
	
	//console.log(newquery);
	console.log(defQuery);
	psqlClient.query(defQuery, function (err, response)
	{
		//console.log(newquery);
        if (err)
        {
            console.log(`Error in database query for buttons\nError is: ${err}`);
            res.end(500);
            return;
        }
        var dbrow = 0; 
    
        for(var i = 0; i <= 7; i++) //each col_n
        {
        	for(var j = 0; i <= 23; i++)//24 hours
        	{
        		//check if db row exists or else break
        			
        		/*
        		if (response.rows === undefined || response.rows.length == 0) 
        		{
        			console.log("NO DATA")
        		}
        		*/
        		    // array empty or does not exist
        		
        		
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
        			//`button${i}[${j}]` = response.row[dbrow].count; 
        			if(i == 0)
        			{
        				button1[j] = response.rows[dbrow].count;  
        			}
        			else if(i ==1)
        			{
        				button2[j] = response.rows[dbrow].count; 
        			}
        			else if(i ==2)
        			{
        				button3[j] = response.rows[dbrow].count; 
        			}
        			else if(i ==3)
        			{
        				button4[j] = response.rows[dbrow].count; 
        			}
        			else if(i ==4)
        			{
        				button5[j] = response.rows[dbrow].count; 
        			}
        			else if(i ==5)
        			{
        				button6[j] = response.rows[dbrow].count; 
        			}
        			else if(i ==6)
        			{
        				button7[j] = response.rows[dbrow].count; 
        			}
        			else if(i ==7)
        			{
        				button8[j] = response.rows[dbrow].count; 
        			}
        			dbrow++;
        		}
        	}	
        }
    
        var graphNumber = 0;
        var srcs = [];
        
        for(var i = 1; i<=8; i++)
        {
        	var graphData = [{x:hour_starts, y:`button${i}`, type: 'bar'}];
        	var layout = {fileopt : "overwrite", filename : "Popgraph${i}"};

            plotly.plot(graphData, layout, function (err, msg)
            {
                if (err)
                {
                    console.log(`Plotly plot error: ${err}`);
                    res.end();
                    return;
                }    

                var url = msg.url;
                var start = url.indexOf('//');
                var suburl = url.slice(start);	
                var newsrc = suburl.concat(".embed");        
                graphNumber++;
                plotUrl = newsrc;
                srcs.push(newsrc);
                //console.log(srcs);
              
                console.log(`Sending plot with url: ${plotUrl}`);
                if(graphNumber == 8)
                {
                	//console.log(srcs);
                	res.json({src: srcs});
                	res.end();
            	}
            });
        }
        //while(graphNumber != 8){}
        //res.json({src: srcs});
    });
}

/*
function plotGraph(data, )
{
	
}
*/


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
	console.log("I value: " + i);
	var index = i;
        ((index) => psqlClient.query(`SELECT count FROM drinks WHERE col_num = ${i-1};`, function (err, response)
        {
	    console.log("Index in callback: " + index);
            if (err)
            {
                console.log(`Error in database query for button ${index}\nError is: ${err}`);
                res.end();
                return;
            }

            console.log(`Query for button ${index} has response: ${JSON.stringify(response)}`);
	    console.log(updateObj);
            updateObj[`button${index}`].count = response.rows[0].count;
            respondedQueries += 1;

            // When all 8 queries have been responded, send the data
            if (respondedQueries == 8)
            {
                console.log("Sending pop table update");
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

function getGraph(res)
{
	/*
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
    */
	
	
	
	
	
	
	
	
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
    //getGraph(res);
	makeButtonGraphs(res);
	
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
