"use strict";
///https://plot.ly/javascript/plotlyjs-function-reference/
$(document).ready(init);

// How often it asks for an update from the database, in ms
const UPDATE_RATE = 10000;
var popUpdateInterval;
const GRAPH_DIV_ID = "graph";
const HOUR_STARTS = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
var bname1 = "Coke";
var bname2 = "Water";
var bname3 = "Sugarless Mystery";
var bname4 = "Canada Dry";
var bname5 = "Nestea";
var bname6 = "Minute Maid";
var bname7 = "Monster";
var bname8 = "Mystery";

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

$('#datepicker').change(function(){
	getGraphDataForDate();
});

$('#graphtype').change(function(){
	getGraphDataForDate();
});

function getGraphDataForDate()
{
	var date = $('#datepicker').val();
	$.ajax({
        url: "/getGraph",
        dataType: "json",
        data: {"date": date},
        method: "POST",
        timeout: 50000,
        success: createGraphAjaxSuccess,
        error: (xhr, status, errorThrown) => console.log(`Graph get error\nStatus: ${status}\nError thrown: ${errorThrown}`)
    });
}

function init()
{
	//set date for graph to be current day
	$('#datepicker').val(new Date().toDateInputValue());
	$('#graphtype').val("scatter");
	
    //display graph
	getGraphDataForDate();
    
    // Set the pop table to be updated every UPDATE_RATE number of ms
   	popUpdateInterval = setInterval(popUpdateGet, UPDATE_RATE);

    // Then call it once to get us started
	popUpdateGet();
}

function initGraph(data)
{
	var graphType = $("#graphtype").val();
	var trace1 = {x: HOUR_STARTS, y: data[0], type: graphType, name: bname1};
	var trace2 = {x: HOUR_STARTS, y: data[1], type: graphType, name: bname2};
	var trace3 = {x: HOUR_STARTS, y: data[2], type: graphType, name: bname3};
	var trace4 = {x: HOUR_STARTS, y: data[3], type: graphType, name: bname4};
	var trace5 = {x: HOUR_STARTS, y: data[4], type: graphType, name: bname5};
	var trace6 = {x: HOUR_STARTS, y: data[5], type: graphType, name: bname6};
	var trace7 = {x: HOUR_STARTS, y: data[6], type: graphType, name: bname7};
	var trace8 = {x: HOUR_STARTS, y: data[7], type: graphType, name: bname8};
	
	var yaxis_template = {title: "STARTING HOUR"};
	var xaxis_template = {title: "PURCHASES"};
	
	
	var graphData = [trace1, trace2, trace3, trace4, trace5, trace6, trace7, trace8];
	var graphLayout = {showlegend: "true", title: "HOURLY NUMBER OF DRINK PURCHASES", 
			xaxis: xaxis_template, yaxis: yaxis_template}; 
	var graphConfig = {};
	var fig = {data: graphData, layout: graphLayout, config: graphConfig};
	return fig;
}

function createGraphAjaxSuccess(data)
{
	var figure = initGraph(data);
	Plotly.newPlot(GRAPH_DIV_ID,figure);
}

function popUpdateGet()
{
    console.log("Updating pop table from database...");

    $.ajax({
        url: "/getPopTableUpdate",
        dataType: "json",
        method: "POST",
        timeout: UPDATE_RATE - 1000, //Might seem weird, but makes sense
        success: popUpdateSuccess,
        error: (xhr, status, errorThrown) => console.log(`Pop database update error\nStatus: ${status}\nError thrown: ${errorThrown}`)
    });
}

function popUpdateSuccess(data)
{
    // There are never EVER going to be more than 8 buttons on this system...
    for (var i = 1; i <= 8; i++)
    {
        // Set the count column of each button's row to the count value we got
        $(`#button${i}Count`).text(data[`button${i}`].count);
    }
}
