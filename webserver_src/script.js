"use strict";

$(document).ready(init);

function init()
{
    $.ajax({
        url: "/getGraph",
        dataType: "json",
        method: "POST",
        timeout: 5000,
        success: graphAjaxSuccess,
        error: (xhr, status, errorThrown) => console.log(`Status: ${status}\nError thrown: ${errorThrown}`)
    });
}

function graphAjaxSuccess(data)
{
    $("#graph").attr("src", data.src);
    $("#graph").attr("hidden", false);
}