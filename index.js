
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
let eightPlayers=[];
let snipPlayers=[];
let fishPlayers=[];
let clientcounter=0;
let playernumber=0;
let currentGame=0;

//return static page with websocket client
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
var server = app.listen(port, function () {
    console.log('node.js static server listening on port: ' + port + ", with websockets listener")
})
const ws = new SocketServer({ server });
//init Websocket ws and handle incoming connect requests
ws.on('connection', function connection(ws) {
    console.log("Sucessful connection");
    
    if(!webSockets.includes(ws)) {
        ws.clientNumber=clientcounter;
        ws.playerNumber=clientcounter++;
        ws.logedIn=logedin;
        playernumber=ws.playerNumber;
        ws.online=false;
        webSockets.push(ws);
        //webSockets[webSockets.indexOf(ws)].userNumber=clientCounter++;
    }
    //on connect message
    ws.on('message', function incoming(message) {
        let userMess = JSON.parse(message);
        
        //take an action based on the action of the message
        //let s=webSockets.indexOf(ws);
        //console.log("s="+s);
        if(userMess.action=="create"){
            createlogin(userMess,ws);
        }
        else if(userMess.action=="login"){
            login(userMess,ws);
        }
        else if(userMess.action=="Crazy Eights"){
            //console.log("Going to Crazy Eights");
            crazyEights(userMess,ws);
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

function crazyEights(message,ws){
    console.log("We are playing Crazy eights");
    
    if(message.gameact=="Play"){
        //console.log("beginning to play Crazy Eights");
        eightsPlay();
    }
    else if(message.gameact=="cardSelected"){
        console.log("We have selected a new card to put down");
        cardSelected(message,webSockets[webSockets.indexOf(ws)].playerNumber);
    }
    else if(message.gameact=="cardPicked"){
        console.log("We are picking up a new card");
        //webSockets=[];
        cardPicked(webSockets[webSockets.indexOf(ws)].playerNumber);
    }
    else if(message.gameact=="quit"){
        //notify the other player that current user has quit
        //and that they have won the game
    }
    
    /*if(userMessage.action == "cardPicked") {
            cardPicked(webSockets[webSockets.indexOf(ws)].userNumber);

        } else {
            cardSelected(data, webSockets[webSockets.indexOf(ws)].userNumber);

        }
    */
}

function eightsPlay(){
    //console.log("inside eightsPlay");
        if(clientcounter%2==1) {
            //crazyGames++;
            //currentGame=crazyGames;
            //console.log("adding a player 1");
            /*
            if(crazyGames>1){//set up for a new game to be played
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
            */
            let obj = {};
            obj.action="Crazy Eights";
            obj.status = "Waiting for player to join";
            obj.numberOfOpponentCards = crazyEightPlayers[clientcounter].getHandCopy().length;
            obj.pileTopCard = eightPile.getTopCard();
            obj.pileAnnouncedSuit = eightPile.getAnnouncedSuit();
            //console.log("The pile's card is "+eightPile.getTopCard());
            //console.log("The pile's suit is "+eightPile.getAnnouncedSuit());
            obj.yourCards = crazyEightPlayers[clientcounter-1].getHandCopy();
            obj.readyToPlay = false;
            //console.log(obj.action + " " + obj.status+ " "+ obj.readyToPlay);
            webSockets[clientcounter-1].send(JSON.stringify(obj));

    } else if(clientcounter%2==0){
        //console.log("Adding a player 2");
        let obj = {};
        obj.action="Crazy Eights";
        obj.status = "Your turn";
        obj.numberOfOpponentCards = crazyEightPlayers[clientcounter-2].getHandCopy().length;
        obj.pileTopCard = eightPile.getTopCard();
        obj.pileAnnouncedSuit = eightPile.getAnnouncedSuit();
        obj.yourCards = crazyEightPlayers[clientcounter-1].getHandCopy();
        obj.readyToPlay = true;

        webSockets[clientcounter-1].send(JSON.stringify(obj));
        //console.log(obj.action + " " + obj.status+ " "+ obj.readyToPlay);
    }

}
///*
function cardSelected(message, playerNumber){
    let announcedSuit = message.announcedSuit;
    let card = message.card;
    let tempCard = new Card(card.suit, card.value);
    let hand = crazyEightPlayers[playerNumber].getHandCopy();

   //Remove the card selected by client from Player's hand
    let index = 0;
    for(let i = 0; i < hand.length; i++) {
      if(hand[i].suit == tempCard.suit && hand[i].value == tempCard.value) {
        index = i;
        break;
      }
    }
    crazyEightPlayers[playerNumber].remove(index); // Could be 1

    eightPile.acceptACard(tempCard);

    if (tempCard.getValue() == "8") {
        eightPile.setAnnouncedSuit(tempCard.getSuit());
    }

    let obj = {};

    if(crazyEightPlayers[playerNumber].isHandEmpty()) {
        obj.action="Crazy Eights";
        obj.status = "Congratulations, You won";
        obj.numberOfOpponentCards = crazyEightPlayers[1-playerNumber].getHandCopy().length;
        obj.pileTopCard = eightPile.getTopCard();
        obj.pileAnnouncedSuit = eightPile.getAnnouncedSuit();
        obj.yourCards = crazyEightPlayers[playerNumber].getHandCopy();
        obj.readyToPlay = false;

        webSockets[playerNumber].send(JSON.stringify(obj));
    
        obj.action="Crazy Eights";
        obj.status = "Sorry you lost";
        obj.numberOfOpponentCards = crazyEightPlayers[playerNumber].getHandCopy().length;
        obj.pileTopCard = eightPile.getTopCard();
        obj.pileAnnouncedSuit = eightPile.getAnnouncedSuit();
        obj.yourCards = crazyEightPlayers[1-playerNumber].getHandCopy();
        obj.readyToPlay = false;

        webSockets[1-playerNumber].send(JSON.stringify(obj));
        
    }else if(crazyEightPlayers[1-playerNumber].isHandEmpty()) {
        obj.action="Crazy Eights";
        obj.status = "Congratulations, You won";
        obj.numberOfOpponentCards = crazyEightPlayers[playerNumber].getHandCopy().length;
        obj.pileTopCard = eightPile.getTopCard();
        obj.pileAnnouncedSuit = eightPile.getAnnouncedSuit();
        obj.yourCards = crazyEightPlayers[1-playerNumber].getHandCopy();
        obj.readyToPlay = false;

        webSockets[1-playerNumber].send(JSON.stringify(obj));
        
        obj.action="Crazy Eights";
        obj.status = "Sorry you lost";
        obj.numberOfOpponentCards = crazyEightPlayers[1-playerNumber].getHandCopy().length;
        obj.pileTopCard = eightPile.getTopCard();
        obj.pileAnnouncedSuit = eightPile.getAnnouncedSuit();
        obj.yourCards = crazyEightPlayers[playerNumber].getHandCopy();
        obj.readyToPlay = false;

        webSockets[playerNumber].send(JSON.stringify(obj));

    }
      else {
          obj.action="Crazy Eights";
            obj.status = "Your turn. Suit is: " + announcedSuit;
            obj.numberOfOpponentCards = crazyEightPlayers[playerNumber].getHandCopy().length;
            obj.pileTopCard = eightPile.getTopCard();
            obj.pileAnnouncedSuit = eightPile.getAnnouncedSuit();
            obj.yourCards = crazyEightPlayers[1-playerNumber].getHandCopy();
            obj.readyToPlay = true;

            webSockets[1-playerNumber].send(JSON.stringify(obj));
      }
}

function cardPicked(playerNumber){
    let Eight = eightDeck.isTopCardAnEight();
    let drawnCard = eightDeck.dealACard();
    //console.log("PlayerNumber:"+playerNumber);
    crazyEightPlayers[playerNumber].add(drawnCard);

    let obj = {};
    
    obj.action="Crazy Eights";
    obj.status = "You selected card " + drawnCard.getValue() + drawnCard.getSuit();
    obj.numberOfOpponentCards = crazyEightPlayers[1-playerNumber].getHandCopy().length;
    obj.pileTopCard = eightPile.getTopCard();
    obj.pileAnnouncedSuit = eightPile.getAnnouncedSuit();
    obj.yourCards = crazyEightPlayers[playerNumber].getHandCopy();
    obj.readyToPlay = false;

    webSockets[playerNumber].send(JSON.stringify(obj));

    obj.action="Crazy Eights";
    obj.status = "Your turn. Suit is: " + eightPile.getAnnouncedSuit();
    obj.numberOfOpponentCards = crazyEightPlayers[playerNumber].getHandCopy().length;
    obj.pileTopCard = eightPile.getTopCard();
    obj.pileAnnouncedSuit = eightPile.getAnnouncedSuit();
    obj.yourCards = crazyEightPlayers[1-playerNumber].getHandCopy();
    obj.readyToPlay = true;

    webSockets[1-playerNumber].send(JSON.stringify(obj));
}

function eightQuit(){
    if(clientcounter%2==1) {//Handles a player leaving the game
            let obj = {};
            obj.action="Crazy Eights";
            obj.status = "You win. Opponent has left the game";
            obj.numberOfOpponentCards = //crazyEightPlayers[clientcounter].getHandCopy().length;
            //obj.pileTopCard = eightPiles[currentGame-1].getTopCard();
            //obj.pileAnnouncedSuit = eightPiles[currentGame-1].getAnnouncedSuit();
            obj.yourCards = crazyEightPlayers[clientcounter-1].getHandCopy();
            obj.readyToPlay = false;
            //console.log(obj.action + " " + obj.status+ " "+ obj.readyToPlay);
            webSockets[clientcounter-1].send(JSON.stringify(obj));

    } else if(clientcounter%2==0){
        let obj = {};
        obj.action="Crazy Eights";
        obj.status = "You win!! Opponent has left the game";
        //obj.numberOfOpponentCards = crazyEightPlayers[clientcounter-2].getHandCopy().length;
        //obj.pileTopCard = eightPiles[crazyGames-1].getTopCard();
        //obj.pileAnnouncedSuit = eightPiles[crazyGames-1].getAnnouncedSuit();
        obj.yourCards = crazyEightPlayers[clientcounter-1].getHandCopy();
        obj.readyToPlay = false;

        webSockets[clientcounter-1].send(JSON.stringify(obj));
        //console.log(obj.action + " " + obj.status+ " "+ obj.readyToPlay);
    }
}
//*/
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