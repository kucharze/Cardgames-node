
const SocketServer = require('ws').Server;
var express = require('express');
var path = require('path');
var connectedUsers = [];
//init Express
var app = express();
//init Express Router
var router = express.Router();
var port = process.env.PORT || 8080;
app.use(express.static(path.join(__dirname,'/public')));
let webSockets=[];

//return static page with websocket client
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
var server = app.listen(port, function () {
    console.log('node.js static server listening on port: ' + port + ", with websockets listener")
})
const wss = new SocketServer({ server });
//init Websocket ws and handle incoming connect requests
wss.on('connection', function connection(ws) {
    console.log("Sucessful connection");
    if(!webSockets.includes(ws)) {
        webSockets.push(ws);
        //webSockets[webSockets.indexOf(ws)].userNumber=clientCounter++;
    }
    //on connect message
    ws.on('message', function incoming(message) {
        let userMess = JSON.parse(message);
        if(userMess.action="createlogin"){
            createlogin(userMess);
        }
        if(userMess.action="login"){
            login(userMess);
        }
        console.log('received: %s', userMess.user + " "+ userMess.password);
        connectedUsers.push(userMess.user);
    });
    //ws.send('message from server at: ' + new Date());
});


function createlogin(action){
    console.log("Setting up a login");
    console.log('received: %s', action.user + " "+ action.password);
    let mes={};
    mes.action="Succesfully set up a login "+action.user;
    console.log("Loged in");
    webSockets[0].send(JSON.stringify(mes));
    
}

function login(action){
    console.log('received: %s', "Attempting to log in");
    console.log('received: %s', action.user + " "+ action.password);
}