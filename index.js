'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

var sockets = {};
var lastreq = {};

const PORT = process.env.PORT || 3000;
console.log(__dirname);
const INDEX = path.join(__dirname, 'index.html');

function sendServerResponse(res, code, msg, command, key) {
   console.log(msg, command + ' ' + key);
   res.writeHead(code, {'Content-Type': 'application/json'});
   res.end('{ "msg" : "' + msg + '", "key" : "' + key + '", "command" : "' + command + '" }');
}

const server = express()
    .use('/api/v1/:key/:command',function(req,res,next){

        console.log('key: ', req.params.key);
        console.log('command: ', req.params.command);

        var target = io.sockets.connected[sockets[req.params.key]];         //find traget socket with key

        if (typeof target != 'undefined') {
            console.log('socket ', target.fheminit);
        } else {
            sendServerResponse(res, 400, "socket not found", req.params.command, req.params.key);
            return;
        }

        //check command
        var csplit = req.params.command.split(" ");

        if(csplit.length != 3) {
            sendServerResponse(res, 400, "bad command", req.params.command, req.params.key);
            return;
        }

        //var regc = new RegExp(target.fheminit.cregex);
        if(!csplit[0].trim().match(new RegExp(target.fheminit.cregex))) {
            sendServerResponse(res, 400, "command not allowed", req.params.command, req.params.key);
            return;
        }

        //var regd = new RegExp(target.fheminit.dregex);
        if(!csplit[1].trim().match(new RegExp(target.fheminit.dregex))) {
            sendServerResponse(res, 400, "device not allowed", req.params.command, req.params.key);
            return;
        }

        //var rege = new RegExp(target.fheminit.eregex);
        if(!csplit[2].trim().match(new RegExp(target.fheminit.eregex))) {
            sendServerResponse(res, 400, "event not allowed", req.params.command, req.params.key);
            return;
        }

        console.log('command ok: ', csplit);

        var msperreq = (60000 / target.fheminit.reqpermin);
        var timediff = Date.now() - lastreq[req.param.key];

        lastreq[req.param.key] = Date.now();

        console.log(msperreq + ' ' + timediff);

        if(timediff < msperreq) {
            sendServerResponse(res, 429, "rate limit exceeded", req.params.command, req.params.key);
            return;
        }

        //everything looks good, let's send to the socket
        target.emit('command', '{ "command" : "' + req.params.command + '"}');

        sendServerResponse(res, 202, "command send", req.params.command, req.params.key);

        return;
    })
    .listen(PORT, () => console.log('Listening on ${ PORT }'));

const io = socketIO(server);
console.log('io created');

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('fheminit', function(fheminit) {

        sockets[fheminit.key] = socket.id;
        lastreq[fheminit.key] = 0;
        io.sockets.connected[socket.id].fheminit = fheminit;            //save fheminit in socket

        console.log('init .', io.sockets.connected[sockets[fheminit.key]].fheminit);
    });

  socket.on('disconnect', () => console.log('Client disconnected'));
});

setInterval(() => io.emit('time', new Date().toTimeString()), 10000);
