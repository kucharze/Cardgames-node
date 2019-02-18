
const SocketServer = require('ws').Server;
var express = require('express');
var path = require('path');
var connectedUsers = [];
var logedin=false;

//Model classes
const Card = require('./public/Card.js');
const Deck = require('./public/Deck.js');
const Pile = require('./public/Pile.js');
const Player = require('./public/Player.js');

let deck = new Deck();

//deck.shuffle();
//while (deck.isTopCardAnEight()){
//  deck.shuffle();
//}

let pile = new Pile();

let players=[];

//pile.acceptACard(deck.dealACard());

//init Express
var app = express();
//init Express Router
var router = express.Router();
var port = process.env.PORT || 8080;
app.use(express.static(path.join(__dirname,'/public')));
let webSockets=[];
let clientcounter=0;
let playernumber=0;

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
    ws.clientNumber=clientcounter;
    ws.playerNumber=playernumber;
    ws.logedIn=logedin;
    playernumber++;
    clientcounter++;
    ws.online=false;
    if(!webSockets.includes(ws)) {
        webSockets.push(ws);
        //webSockets[webSockets.indexOf(ws)].userNumber=clientCounter++;
    }
    //on connect message
    ws.on('message', function incoming(message) {
        let userMess = JSON.parse(message);
        console.log(userMess.action);
        if(userMess.action=="create"){//take an action based on the action of the message
            createlogin(userMess);
        }
        else if(userMess.action=="login"){
            login(userMess);
        }
        else if(userMess.action=="Crazy Eights"){
            crazyEights(userMess);
        }
        //console.log('received: %s', userMess.user + " "+ userMess.password);
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
    let mes={};
    mes.action="Loged in with user "+action.user;
    console.log("Loged in");
    webSockets[0].send(JSON.stringify(mes));
}

function crazyEights(message){
    console.log("We are attempting to play Crazy eights")
    if(clientcounter%2==1) {
        let obj = {};
        obj.action="Crazy Eights";
        obj.status = "waiting for player to join";
        //obj.numberOfOpponentCards = players[1-clientCounter].getHandCopy().length;
        //obj.pileTopCard = pile.getTopCard();
        //obj.pileAnnouncedSuit = pile.getAnnouncedSuit();
        //obj.yourCards = players[clientCounter-1].getHandCopy();
        obj.readyToPlay = false;

        webSockets[clientcounter-1].send(JSON.stringify(obj));

    } else if(clientcounter%2==0){
        let obj = {};
        
        obj.action="Crazy Eights";
        obj.status = "Your turn";
        //obj.numberOfOpponentCards = players[0].getHandCopy().length;
        //obj.pileTopCard = pile.getTopCard();
        //obj.pileAnnouncedSuit = pile.getAnnouncedSuit();
        //obj.yourCards = players[clientCounter-1].getHandCopy();
        obj.readyToPlay = true;

        webSockets[clientcounter-1].send(JSON.stringify(obj));

    }

      // let userMessage = JSON.parse(data);
    /*
        if(userMessage.action == "cardPicked") {
            cardPicked(webSockets[webSockets.indexOf(ws)].userNumber);

        } else {
            cardSelected(data, webSockets[webSockets.indexOf(ws)].userNumber);

        }
    */
}

function cardSelected(){
    
}

function cardPicked(){
    
}