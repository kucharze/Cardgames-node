
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

let crazyGames=0;

let eightDecks=[];
let eightDeck = new Deck();

eightDeck.shuffle();
while (eightDeck.isTopCardAnEight()){
  eightDeck.shuffle();
}

let eightPiles=[];
let eightPile = new Pile();

eightPile.acceptACard(eightDeck.dealACard());
eightPiles.push(eightPile);
let crazyEightPlayers=[];
crazyEightPlayers.push(new Player(eightDeck));
crazyEightPlayers.push(new Player(eightDeck));

eightPile.acceptACard(eightDeck.dealACard());

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
    ws.playerNumber=clientcounter;
    ws.logedIn=logedin;
    playernumber=ws.playerNumber;
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
            crazyEights(userMess,playernumber);
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
    console.log("We are attempting to play Crazy eights");
    if(message.gameact=="Play"){
        console.log("beginning to play Crazy Eights");
        eightsPlay();
    }
    else if(message.gameact=="cardSelected"){
        cardSelected();
    }
    else if(message.gameact=="cardPicked"){
        cardPicked();
    }

}

function eightsPlay(){
    //console.log("inside eightsPlay")

        if(clientcounter%2==1) {
            crazyGames++;
            console.log("adding a player 1");
            if(crazyGames>1){
                let deck = new Deck();
                deck.shuffle();
                while(deck.isTopCardAnEight()){
                    deck.shuffle();
                }
                let pile=new Pile();
                pile.acceptACard(deck.dealACard());
                eightPiles.push(pile);
                eightDecks.push(deck);
                
                crazyEightPlayers.push(new Player(deck));
                crazyEightPlayers.push(new Player(deck));
                
            }
            
            let obj = {};
            obj.action="Crazy Eights";
            obj.status = "Waiting for player to join";
            obj.numberOfOpponentCards = crazyEightPlayers[1-clientcounter].getHandCopy().length;
            obj.pileTopCard = eightPiles[crazyGames-1].getTopCard();
            obj.pileAnnouncedSuit = eightPiles[crazyGames-1].getAnnouncedSuit();
            obj.yourCards = crazyEightPlayers[clientcounter-1].getHandCopy();
            obj.readyToPlay = false;
            //console.log(obj.action + " " + obj.status+ " "+ obj.readyToPlay);
            webSockets[clientcounter-1].send(JSON.stringify(obj));

    } else if(clientcounter%2==0){
        console.log("Adding a player 2");
        let obj = {};
        obj.action="Crazy Eights";
        obj.status = "Your turn";
        obj.numberOfOpponentCards = crazyEightPlayers[clientCounter-2].getHandCopy().length;
        obj.pileTopCard = eightPiles[crazyGames-1].getTopCard();
        obj.pileAnnouncedSuit = eightPiles[crazyGames-1].getAnnouncedSuit();
        obj.yourCards = crazyEightPlayers[clientcounter-1].getHandCopy();
        obj.readyToPlay = true;

        webSockets[clientcounter-1].send(JSON.stringify(obj));
        console.log(obj.action + " " + obj.status+ " "+ obj.readyToPlay);
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

function snipPlay(message){
    
}

function switchUser(){
    
}

function fishPlay(message){
    
}

function goFish(){
    
}

function askForCard(){
    
}