"use strict";

$(document).ready(init);

// How often it asks for an update from the database, in ms
const UPDATE_RATE = 10000;
var popUpdateInterval;

function init()
{
    $.ajax({
        url: "/getGraph",
        dataType: "json",
        method: "POST",
        timeout: 5000,
        success: graphAjaxSuccess,
        error: (xhr, status, errorThrown) => console.log(`Graph get error\nStatus: ${status}\nError thrown: ${errorThrown}`)
    });

    // Set the pop table to be updated every UPDATE_RATE number of ms
    popUpdateInterval = setInterval(popUpdateGet, UPDATE_RATE);

    // Then call it once to get us started
    popUpdateGet();
}

function graphAjaxSuccess(data)
{
    // Set the new graph url in the iframe and make it visible
    $("#graph").attr("src", data.src);
    $("#graph").attr("hidden", false);
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
        // console.log(`$(\`#button${i}Count\`).text(data[\`button${i}\`].count);`)
        // Set the count column of each button's row to the count value we got
        $(`#button${i}Count`).text(data[`button${i}`].count);
    }
}