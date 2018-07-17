"use strict";
//code found on: http://darrenoneill.co.uk/post/real-time-web-apps-postgresql-and-node/

var io = require('socket.io').listen(9000);
var pg = require ('pg');
					//change for our db
var con_string = 'tcp://username:password@localhost/dbname';

var pg_client = new pg.Client(con_string);
pg_client.connect();
var query = pg_client.query('LISTEN addedrecord');

io.sockets.on('connection', function (socket) {
    socket.emit('connected', { connected: true });

    socket.on('ready for data', function (data) {
        pg_client.on('notification', function(title) {
            socket.emit('update', { message: title });
        });
    });
});