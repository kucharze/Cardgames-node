/*
var express = require('express');
var app = express();
var path = require('path');
const WebSocket = require('ws');
var mon = require('mongoose');

https://devcenter.heroku.com/articles/node-websockets
https://github.com/heroku-examples/node-websockets/blob/master/server.js
//var dbUrl = ‘mongodb://username:pass@ds257981.mlab.com:57981/simple-chat’
mongoose.connect(dbUrl , (err) => { 
   console.log(‘mongodb connected’,err);
})

var Message = mongoose.model(‘Message’,{ name : String, message : String})


//let socket = new WebSocket.Server({port:process.env.PORT || 8080}, () => {console.log("Server Started");});

app.use(express.static(path.join(__dirname,'/public')));

//app.use('/resources',express.static(__dirname,'/Images'));

// viewed at http://localhost:3000
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(process.env.PORT || 8080, function(){});
*/
///*
const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'public/index.html');

express.static(path.join(__dirname,'/public'));

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
});

setInterval(() => {
  wss.clients.forEach((client) => {
    client.send(new Date().toTimeString());
  });
}, 1000);
//*/