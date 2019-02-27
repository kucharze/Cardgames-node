
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

//neccesities to play Crazy eights
let eightPlayers=[];
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

let eightSockets=[];//websockets of players playing Crazy Eights
let crazyEightPlayers=[];
crazyEightPlayers.push(new Player(eightDeck));
crazyEightPlayers.push(new Player(eightDeck));

eightPile.acceptACard(eightDeck.dealACard());


//Snip Snap Snorum necessities
let snipPile=new Pile();
let snipDeck=new Deck();
snipDeck.shuffle();
snipDeck.shuffle();

let snipPlayers=[];
let snipSockets=[];//websockets playing sss online

snipPlayers.push(new Player(snipDeck));
snipPlayers.push(new Player(snipDeck));

for(var i=0; i<14; i++){
    snipPlayers[0].list.push(snipDeck.dealACard());
}

for(var i=0; i<14; i++){
    snipPlayers[1].list.push(snipDeck.dealACard());
}

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
        else if(userMess.action=="Snip Snap Snorum"){
            console.log("Going to Snip Snap Snorum");
            snipSnapSnorum(userMess,ws);
        }
        else if(userMess.action=="Gofish"){
            //call method to go to go fish option
            goFish(userMess,ws);
        }
        //console.log('received: %s', userMess.user + " "+ userMess.password);
        //connectedUsers.push(userMess.user);
    });
    
});

function sendMessage(message){
    console.log("sending a chat message");
    
    if(message.dest=="Crazy Eights"){
        console.log("send message to Crazy eights chat room");
    }
    else if(message.dest=="Snip Snap Snorum"){
        console.log("send message to sss chat room");
    }
    else if(message.dest=="Go Fish"){
        console.log("Send message to go fish chat room");
    }
}


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

/*
Options that can take place while playing Crazy Eights
Options can be either online or offline
*/
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
        eightQuit(webSockets[webSockets.indexOf(ws)].playerNumber);
    }
    else if(message.gameact=="record"){
        //record data from offline into the database
    }
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
                while(deck.isTopCardAnEight()){deck.shuffle();}
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
            obj.yourCards = crazyEightPlayers[clientcounter-1].getHandCopy();
            obj.readyToPlay = false;
            
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
    }
    //console.log(obj.action + " " + obj.status+ " "+ obj.readyToPlay);
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

function eightQuit(playernumber){
    if(playernumber==0) {//Handles a player leaving the game
            let obj = {};
            obj.action="Crazy Eights";
            obj.status = "You win!! Opponent has forfiet!";
            obj.numberOfOpponentCards = crazyEightPlayers[1].getHandCopy().length;
            obj.pileTopCard = eightPile.getTopCard();
            obj.pileAnnouncedSuit = eightPile.getAnnouncedSuit();
            obj.yourCards = crazyEightPlayers[0].getHandCopy();
            obj.readyToPlay = false;
            webSockets[1].send(JSON.stringify(obj));

    } else if(playernumber==1){
        let obj = {};
        obj.action="Crazy Eights";
        obj.status = "You win!! Opponent has forfiet!";
        obj.numberOfOpponentCards = crazyEightPlayers[0].getHandCopy().length;
        obj.pileTopCard = eightPile.getTopCard();
        obj.pileAnnouncedSuit = eightPile.getAnnouncedSuit();
        obj.yourCards = crazyEightPlayers[playernumber].getHandCopy();
        obj.readyToPlay = false;

        webSockets[0].send(JSON.stringify(obj));
    }
    //console.log(obj.action + " " + obj.status+ " "+ obj.readyToPlay);
}

function snipSnapSnorum(message,ws){
    if(message.gameact=="Play"){
        snipPlay();
    }
    else if(message.gameact=="pass turn"){
        //pass pla to the other user
        switchUser(message, webSockets[webSockets.indexOf(ws)].playerNumber);
    }
    else if(message.gameact=="victory"){
        console.log("A player has won the game");
        victory(message, webSockets[webSockets.indexOf(ws)].playerNumber);
    }
    else if(message.gameact=="quit"){
        console.log("Quitting snip snap snorum");
        snipQuit(webSockets[webSockets.indexOf(ws)].playerNumber);
    }
}

//*/
function snipPlay(){
    console.log("We are playing Snip Snap Snorum");
    if(clientcounter%2==1) {
        ///*
        let obj = {};
        obj.action="Snip Snap Snorum";
        obj.status = "Waiting for player to join";
        obj.snip=false;
        obj.snap=false;
        obj.numberOfOpponentCards = snipPlayers[clientcounter].getHandCopy().length;
        obj.pileTopCard = null;
        obj.yourCards = snipPlayers[clientcounter-1].getHandCopy();
        obj.readyToPlay = false;
        webSockets[clientcounter-1].send(JSON.stringify(obj));
        //*/
    } else if(clientcounter%2==0){  
        let obj = {};
        obj.action="Snip Snap Snorum";
        obj.status = "You may start the round";
        obj.snip=false;
        obj.snap=false;
        obj.numberOfOpponentCards = snipPlayers[clientcounter-2].getHandCopy().length;
        obj.pileTopCard = null;
        obj.yourCards = snipPlayers[clientcounter-1].getHandCopy();
        obj.readyToPlay = true;
        webSockets[clientcounter-1].send(JSON.stringify(obj));
        //*/
    }
    
}

function victory(message, playerNumber){
     let pileCard = message.pileCard;
    let tempCard = new Card(pileCard.suit, pileCard.value);
    snipPile.acceptACard(tempCard);
    let hand = message.hand;
    let newHand = JSON.parse(JSON.stringify( hand ),
            (k,v)=>(typeof v.suit)!=="undefined" ? new Card(v.suit, v.value) : v);
    
    snipPlayers[playerNumber].setHand(hand);
    
    let snip=message.snip;
    let snap=message.snap;
    //console.log("snip "+message.snip);
    //console.log("snap "+message.snap);
    let obj={};
    
    obj.action="Snip Snap Snorum";
    obj.status="Sorry you lose";
    obj.pileTopCard=snipPile.getTopCard();
    obj.yourCards=snipPlayers[1-playerNumber].getHandCopy();
    obj.snip=false;
    obj.snap=false;
    obj.numberOfOpponentCards=snipPlayers[playerNumber].getHandCopy().length;
    obj.readyToPlay=false;
    webSockets[1-playerNumber].send(JSON.stringify(obj));
            
    obj.action="Snip Snap Snorum";
    obj.status="Congradulations You win";
    obj.pileTopCard=snipPile.getTopCard();
    obj.yourCards=snipPlayers[playerNumber].getHandCopy();
    obj.snip=false;
    obj.snap=false;
    obj.numberOfOpponentCards=snipPlayers[1-playerNumber].getHandCopy().length;
    obj.readyToPlay=false;
    webSockets[playerNumber].send(JSON.stringify(obj));
}

function switchUser(message, playerNumber){
    //console.log("the player number is "+playerNumber);
    
    let pileCard = message.pileCard;
    let tempCard = new Card(pileCard.suit, pileCard.value);
    snipPile.acceptACard(tempCard);
    let hand = message.hand;
    let newHand = JSON.parse(JSON.stringify( hand ),
            (k,v)=>(typeof v.suit)!=="undefined" ? new Card(v.suit, v.value) : v);
    
    snipPlayers[playerNumber].setHand(hand);
    
    let snip=message.snip;
    let snap=message.snap;
    //console.log("snip "+message.snip);
    //console.log("snap "+message.snap);
    let obj={};
    
    obj.action="Snip Snap Snorum";
    obj.status="It is now your turn";
    obj.pileTopCard=snipPile.getTopCard();
    obj.yourCards=snipPlayers[1-playerNumber].getHandCopy();
    obj.snip=snip;
    obj.snap=snap;
    obj.numberOfOpponentCards=snipPlayers[playerNumber].getHandCopy().length;
    obj.readyToPlay=true;
    webSockets[1-playerNumber].send(JSON.stringify(obj));

    
    obj.action="Snip Snap Snorum";
    obj.status="Please wait for the other player to play";
    obj.pileTopCard=snipPile.getTopCard();
    obj.yourCards=snipPlayers[playerNumber].getHandCopy();
    obj.snip=snip;
    obj.snap=snap;
    obj.numberOfOpponentCards=snipPlayers[1-playerNumber].getHandCopy().length;
    obj.readyToPlay=false;
    webSockets[playerNumber].send(JSON.stringify(obj));
}

function snipQuit(playernumber){
    if(playernumber==0) {//Handles a player leaving the game
        let obj = {};
        obj.action="Snip Snap Snorum";
        obj.status = "You win!! Opponent has forfeit!";
        obj.numberOfOpponentCards = snipPlayers[1].getHandCopy().length;
        obj.snip=false;
        obj.snap=false;
        obj.pileTopCard = snipPile.getTopCard();
        obj.yourCards = snipPlayers[0].getHandCopy();
        obj.readyToPlay = false;
        
        webSockets[1].send(JSON.stringify(obj));

    } else if(playernumber==1){
        let obj = {};
        obj.action="Snip Snap Snorum";
        obj.status = "You win!! Opponent has forfeit!";
        obj.numberOfOpponentCards = crazyEightPlayers[0].getHandCopy().length;
        obj.pileTopCard = snipPile.getTopCard();
        obj.snip=false;
        obj.snap=false;
        obj.yourCards = crazyEightPlayers[playernumber].getHandCopy();
        obj.readyToPlay = false;

        webSockets[0].send(JSON.stringify(obj));
    }
}

function playGoFish(message, ws){
    if(message.gameact=="play"){
        fishPlay();
    }
    else if(message.gameact=="goFish"){
        console.log("Saying Go Fish");
        gofish(messae, webSockets[webSockets.indexOf(ws)].playerNumber);
    }
    else if(message.gameact=="ask for card"){
        console.log("asking the other player for a card");
        askForCard(messae, webSockets[webSockets.indexOf(ws)].playerNumber);
    }
    else if(message.gameact=="Give a card"){
        console.log("Giving a card to the other player");
    }
    else if(message.gameact=="quit"){
        console.log("Quitting play for go fish");
        quitFish();
    }
}


function fishPlay(){
    
}

function goFish(){
    
}

function askForCard(){
    
}

function quitFish(){
    
}