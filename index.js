
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
eightDecks.push(eightDeck);

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
let snipPiles=[];
let snipDecks=[];
let snipPile=new Pile();
let snipDeck=new Deck();
snipDeck.shuffle();
snipDeck.shuffle();
snipPiles.push(snipPile);
snipDecks.push(snipDeck);

let snipPlayers=[];
let snipSockets=[];//websockets playing sss online

snipPlayers.push(new Player(snipDeck));
snipPlayers.push(new Player(snipDeck));

for(var i=0; i<17; i++){
    snipPlayers[0].list.push(snipDeck.dealACard());
}

for(var i=0; i<17; i++){
    snipPlayers[1].list.push(snipDeck.dealACard());
}

//Go Fish necessities
let fishDecks=[];
let fishDeck=new Deck();
fishDeck.shuffle();
fishDeck.shuffle();

//let fishPile=new Pile();
fishDecks.push(fishDeck);
let fishPlayers=[];
let fishSockets=[];
let fourOfs=[];

fourOfs.push(0);
fourOfs.push(0);

fishPlayers.push(new Player(fishDeck));
fishPlayers.push(new Player(fishDeck));

//below temporary for testing
for(var i=0; i<16; i++){
    fishPlayers[0].add(fishDeck.dealACard());
}

for(var i=0; i<16; i++){
    fishPlayers[1].add(fishDeck.dealACard());
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
        console.log("action="+userMess.action);
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
        else if(userMess.action=="Go Fish"){
            console.log("Going to Go Fish");
            playGoFish(userMess,ws);
        }
        //console.log('received: %s', userMess.user + " "+ userMess.password);
        //connectedUsers.push(userMess.user);
    });
    ws.on('close',function close(){
        console.log("user is disconnecting");
    });
});

function sendMessage(message){//For a later use of chatroom function
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

//Creates a login for the site
function createlogin(action){
    console.log("Setting up a login");
    console.log('received: %s', action.user + " "+ action.password);
    let mes={};
    mes.action="Succesfully set up a login "+action.user;
    console.log("Loged in");
    webSockets[0].send(JSON.stringify(mes));
}

//Login to the website
//Check if given name and pass are in the database
//If not do not allow login
function login(action){
    let good=true;
    console.log('received: %s', "Attempting to log in");
    console.log('received: %s', action.user + " "+ action.password);
    let mes={};
    mes.action="Loged in with user "+action.user;
    console.log("Loged in");
    webSockets[0].send(JSON.stringify(mes));
    
    if(good){
        console.log("The username and pass are good");
    }
    else{
        console.log("The login attempt has failed");
    }
}

/*
Options that can take place while playing Crazy Eights
Options can be either online or offline
*/
function crazyEights(message,ws){
    console.log("We are playing Crazy eights");
    
    if(message.gameact=="Play"){
        //console.log("beginning to play Crazy Eights");
        eightsPlay(ws);
    }
    else if(message.gameact=="cardSelected"){
        console.log("We have selected a new card to put down");
        cardSelected(message,eightSockets.indexOf(ws));
    }
    else if(message.gameact=="cardPicked"){
        console.log("We are picking up a new card");
        cardPicked(eightSockets.indexOf(ws));
    }
    else if(message.gameact=="quit"){
        //notify the other player that current user has quit
        //and that they have won the game
        eightQuit(webSockets[webSockets.indexOf(ws)].playerNumber);
    }
    else if(message.gameact=="record"){
        //record data from offline into the database
        console.log("Recoding into Crazy Eights database");
    }
}

function eightsPlay(ws){
    //console.log("inside eightsPlay");
    eightSockets.push(ws);
        if(eightSockets.indexOf(ws)%2==0) {
            let obj = {};
            obj.action="Crazy Eights";
            obj.status = "Waiting for player to join";
            obj.numberOfOpponentCards = crazyEightPlayers[eightSockets.indexOf(ws)+1].getHandCopy().length;
            obj.pileTopCard = eightPile.getTopCard();
            obj.pileAnnouncedSuit = eightPile.getAnnouncedSuit();
            obj.yourCards = crazyEightPlayers[eightSockets.indexOf(ws)].getHandCopy();
            obj.readyToPlay = false;
            
            webSockets[eightSockets.indexOf(ws)].send(JSON.stringify(obj));

    } else if(eightSockets.indexOf(ws)%2==1){
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
        
         ///*
            //set up for a new game to be played if more players join
                let deck = new Deck();
                deck.shuffle();
                while(deck.isTopCardAnEight()){deck.shuffle();}
                let pile=new Pile();
                pile.acceptACard(deck.dealACard());
                eightPiles.push(pile);
                eightDecks.push(deck);
                
                crazyEightPlayers.push(new Player(deck));
                crazyEightPlayers.push(new Player(deck));
            
           //*/
    }
    //console.log(obj.action + " " + obj.status+ " "+ obj.readyToPlay);
}
///*
function cardSelected(message, playerNumber){
    let announcedSuit = message.announcedSuit;
    let card = message.card;
    let tempCard = new Card(card.suit, card.value);
    let hand = crazyEightPlayers[playerNumber].getHandCopy();
    let gamenum=0;
    let odd=false;
    
    //determine which game to play
    if(playerNumber%2 == 0){
        //console.log("Even Player");
        gamenum=(playerNumber)/2;
    }
    else{
        //console.log("odd player");
        gamenum=(playerNumber-1)/2;
        odd=true;
    }

   //Remove the card selected by client from Player's hand
    let index = 0;
    for(let i = 0; i < hand.length; i++) {
      if(hand[i].suit == tempCard.suit && hand[i].value == tempCard.value) {
        index = i;
        break;
      }
    }
    crazyEightPlayers[playerNumber].remove(index); // Could be 1
    eightPiles[gamenum].acceptACard(tempCard);

    if (tempCard.getValue() == "8") {
        //console.log("Card is an eight, Chaning suit to "+announcedSuit);
        eightPiles[gamenum].setAnnouncedSuit(announcedSuit);
    }
    //console.log(eightPiles[gamenum].getAnnouncedSuit());
    let obj = {};
    
    if(odd){//odd player number
        if(crazyEightPlayers[playerNumber].isHandEmpty()) {
            console.log("odd player wins");
           obj.status = "Congratulations, You won";
            obj.numberOfOpponentCards = crazyEightPlayers[playerNumber-1].getHandCopy().length;
            obj.pileTopCard = eightPiles[gamenum].getTopCard();
            obj.pileAnnouncedSuit = eightPiles[gamenum].getAnnouncedSuit();
            obj.yourCards = crazyEightPlayers[playerNumber].getHandCopy();
            obj.readyToPlay = false;

            eightSockets[playerNumber].send(JSON.stringify(obj));
    
            obj.action="Crazy Eights";
            obj.status = "Sorry you lost";
            obj.numberOfOpponentCards = crazyEightPlayers[playerNumber].getHandCopy().length;
            obj.pileTopCard = eightPiles[gamenum].getTopCard();
            obj.pileAnnouncedSuit = eightPiles[gamenum].getAnnouncedSuit();
            obj.yourCards = crazyEightPlayers[playerNumber-1].getHandCopy();
            obj.readyToPlay = false;

            eightSockets[playerNumber-1].send(JSON.stringify(obj)); 
        }else if(crazyEightPlayers[playerNumber-1].isHandEmpty()) {
            obj.status = "Congratulations, You won";
            obj.numberOfOpponentCards = crazyEightPlayers[1-playerNumber].getHandCopy().length;
            obj.pileTopCard = eightPiles[gamenum].getTopCard();
            obj.pileAnnouncedSuit = eightPiles[gamenum].getAnnouncedSuit();
            obj.yourCards = crazyEightPlayers[playerNumber].getHandCopy();
            obj.readyToPlay = false;

            eightSockets[playerNumber].send(JSON.stringify(obj));
    
            obj.action="Crazy Eights";
            obj.status = "Sorry you lost";
            obj.numberOfOpponentCards = crazyEightPlayers[playerNumber].getHandCopy().length;
            obj.pileTopCard = eightPiles[gamenum].getTopCard();
            obj.pileAnnouncedSuit = eightPiles[gamenum].getAnnouncedSuit();
            obj.yourCards = crazyEightPlayers[1-playerNumber].getHandCopy();
            obj.readyToPlay = false;

            eightSockets[1-playerNumber].send(JSON.stringify(obj)); 
    }else{
            obj.status = "Waiting for opponent to play";
            obj.numberOfOpponentCards = crazyEightPlayers[playerNumber-1].getHandCopy().length;
            obj.pileTopCard = eightPiles[gamenum].getTopCard();
            obj.pileAnnouncedSuit = eightPiles[gamenum].getAnnouncedSuit();
            obj.yourCards = crazyEightPlayers[playerNumber].getHandCopy();
            obj.readyToPlay = false;

            eightSockets[playerNumber].send(JSON.stringify(obj));
    
            obj.action="Crazy Eights";
            obj.status = "Your turn. Suit is "+announcedSuit;
            obj.numberOfOpponentCards = crazyEightPlayers[playerNumber].getHandCopy().length;
            obj.pileTopCard = eightPiles[gamenum].getTopCard();
            obj.pileAnnouncedSuit = eightPiles[gamenum].getAnnouncedSuit();
            obj.yourCards = crazyEightPlayers[playerNumber-1].getHandCopy();
            obj.readyToPlay = true;

            eightSockets[playerNumber-1].send(JSON.stringify(obj)); 
      }
    }else{//even player number
        if(crazyEightPlayers[playerNumber].isHandEmpty()) {
            obj.status = "Congratulations, You won";
            obj.numberOfOpponentCards = crazyEightPlayers[playerNumber+1].getHandCopy().length;
            obj.pileTopCard = eightPiles[gamenum].getTopCard();
            obj.pileAnnouncedSuit = eightPiles[gamenum].getAnnouncedSuit();
            obj.yourCards = crazyEightPlayers[playerNumber].getHandCopy();
            obj.readyToPlay = false;

            eightSockets[playerNumber].send(JSON.stringify(obj));
    
            obj.action="Crazy Eights";
            obj.status = "Sorry you lost";
            obj.numberOfOpponentCards = crazyEightPlayers[playerNumber].getHandCopy().length;
            obj.pileTopCard = eightPiles[gamenum].getTopCard();
            obj.pileAnnouncedSuit = eightPiles[gamenum].getAnnouncedSuit();
            obj.yourCards = crazyEightPlayers[playerNumber+1].getHandCopy();
            obj.readyToPlay = false;

            eightSockets[playerNumber+1].send(JSON.stringify(obj));
        
    }else if(crazyEightPlayers[playerNumber+1].isHandEmpty()) {
            obj.status = "Congratulations, You won";
            obj.numberOfOpponentCards = crazyEightPlayers[playerNumber+1].getHandCopy().length;
            obj.pileTopCard = eightPiles[gamenum].getTopCard();
            obj.pileAnnouncedSuit = eightPiles[gamenum].getAnnouncedSuit();
            obj.yourCards = crazyEightPlayers[playerNumber].getHandCopy();
            obj.readyToPlay = false;

            eightSockets[playerNumber].send(JSON.stringify(obj));
    
            obj.action="Crazy Eights";
            obj.status = "Sorry you lost";
            obj.numberOfOpponentCards = crazyEightPlayers[playerNumber].getHandCopy().length;
            obj.pileTopCard = eightPiles[gamenum].getTopCard();
            obj.pileAnnouncedSuit = eightPiles[gamenum].getAnnouncedSuit();
            obj.yourCards = crazyEightPlayers[playerNumber+1].getHandCopy();
            obj.readyToPlay = false;

            eightSockets[playerNumber+1].send(JSON.stringify(obj));
    }
      else {
            obj.status = "Waiting for opponent to play";
            obj.numberOfOpponentCards = crazyEightPlayers[playerNumber+1].getHandCopy().length;
            obj.pileTopCard = eightPiles[gamenum].getTopCard();
            obj.pileAnnouncedSuit = eightPiles[gamenum].getAnnouncedSuit();
            obj.yourCards = crazyEightPlayers[playerNumber].getHandCopy();
            obj.readyToPlay = false;

            eightSockets[playerNumber].send(JSON.stringify(obj));
    
            obj.action="Crazy Eights";
            obj.status = "Your turn. Suit is "+announcedSuit;
            obj.numberOfOpponentCards = crazyEightPlayers[playerNumber].getHandCopy().length;
            obj.pileTopCard = eightPiles[gamenum].getTopCard();
            obj.pileAnnouncedSuit = eightPiles[gamenum].getAnnouncedSuit();
            obj.yourCards = crazyEightPlayers[playerNumber+1].getHandCopy();
            obj.readyToPlay = true;

            eightSockets[playerNumber+1].send(JSON.stringify(obj));
      }
    }
}

function cardPicked(playerNumber){
    let odd=false;
    
    if(playerNumber%2 == 0){
        gamenum=(playerNumber)/2;
    }
    else{
        gamenum=(playerNumber-1)/2;
        odd=true;
    }
    
    let Eight = eightDecks[gamenum].isTopCardAnEight();
    let drawnCard = eightDecks[gamenum].dealACard();
    crazyEightPlayers[playerNumber].add(drawnCard);

    let obj = {};
    
    if(odd){//odd player number
        obj.action="Crazy Eights";
        obj.status = "You selected card " + drawnCard.getValue() + drawnCard.getSuit();
        obj.numberOfOpponentCards = crazyEightPlayers[playerNumber-1].getHandCopy().length;
        obj.pileTopCard = eightPiles[gamenum].getTopCard();
        obj.pileAnnouncedSuit = eightPiles[gamenum].getAnnouncedSuit();
        obj.yourCards = crazyEightPlayers[playerNumber].getHandCopy();
        obj.readyToPlay = false;

        eightSockets[playerNumber].send(JSON.stringify(obj));

        obj.action="Crazy Eights";
        obj.status = "Your turn. Suit is: " + eightPile.getAnnouncedSuit();
        obj.numberOfOpponentCards = crazyEightPlayers[playerNumber].getHandCopy().length;
        obj.pileTopCard = eightPiles[gamenum].getTopCard();
        obj.pileAnnouncedSuit = eightPiles[gamenum].getAnnouncedSuit();
        obj.yourCards = crazyEightPlayers[playerNumber-1].getHandCopy();
        obj.readyToPlay = true;

        eightSockets[playerNumber-1].send(JSON.stringify(obj));
    }else{//even player number
        obj.action="Crazy Eights";
        obj.status = "You selected card " + drawnCard.getValue() + drawnCard.getSuit();
        obj.numberOfOpponentCards = crazyEightPlayers[playerNumber+1].getHandCopy().length;
        obj.pileTopCard = eightPiles[gamenum].getTopCard();
        obj.pileAnnouncedSuit = eightPiles[gamenum].getAnnouncedSuit();
        obj.yourCards = crazyEightPlayers[playerNumber].getHandCopy();
        obj.readyToPlay = false;

        eightSockets[playerNumber].send(JSON.stringify(obj));

        obj.action="Crazy Eights";
        obj.status = "Your turn. Suit is: " + eightPile.getAnnouncedSuit();
        obj.numberOfOpponentCards = crazyEightPlayers[playerNumber].getHandCopy().length;
        obj.pileTopCard = eightPiles[gamenum].getTopCard();
        obj.pileAnnouncedSuit = eightPiles[gamenum].getAnnouncedSuit();
        obj.yourCards = crazyEightPlayers[playerNumber+1].getHandCopy();
        obj.readyToPlay = true;

        eightSockets[playerNumber+1].send(JSON.stringify(obj));
    }
}

function eightQuit(playernumber){
    if(playernumber%2 == 0){
        gamenum=(playernumber)/2;
    }
    else{
        gamenum=(playernumber-1)/2;
    }
    
    if(playernumber%2 ==0) {//Handles a player leaving the game
            let obj = {};
            obj.action="Crazy Eights";
            obj.status = "You win!! Opponent has forfiet!";
            obj.numberOfOpponentCards = crazyEightPlayers[playernumber+1].getHandCopy().length;
            obj.pileTopCard = eightPiles[gamenum].getTopCard();
            obj.pileAnnouncedSuit = eightPiles[gamenum].getAnnouncedSuit();
            obj.yourCards = crazyEightPlayers[playernumber].getHandCopy();
            obj.readyToPlay = false;
            eightSockets[playernumber+1].send(JSON.stringify(obj));
            eightSockets[playernumber]=null;

    } else if(playernumber%2 ==1){
        let obj = {};
        obj.action="Crazy Eights";
        obj.status = "You win!! Opponent has forfiet!";
        obj.numberOfOpponentCards = crazyEightPlayers[playernumber-1].getHandCopy().length;
        obj.pileTopCard = eightPiles[gamenum].getTopCard();
        obj.pileAnnouncedSuit = eightPiles[gamenum].getAnnouncedSuit();
        obj.yourCards = crazyEightPlayers[playernumber].getHandCopy();
        obj.readyToPlay = false;

        eightSockets[playernumber-1].send(JSON.stringify(obj));
        eightSockets[playernumber]=null;
    }
}

function snipSnapSnorum(message,ws){
    if(message.gameact=="Play"){
        snipPlay(ws);
    }
    else if(message.gameact=="pass turn"){
        //pass pla to the other user
        switchUser(message, snipSockets.indexOf(ws));
    }
    else if(message.gameact=="victory"){
        console.log("A player has won the game");
        victory(message, snipSockets.indexOf(ws));
    }
    else if(message.gameact=="quit"){
        console.log("Quitting snip snap snorum");
        snipQuit(snipSockets.indexOf(ws));
    }
}

//*/
function snipPlay(ws){
    console.log("We are playing Snip Snap Snorum");
    snipSockets.push(ws);
    if(snipSockets.indexOf(ws)%2==0) {
        ///*
        let obj = {};
        obj.action="Snip Snap Snorum";
        obj.status = "Waiting for player to join";
        obj.snip=false;
        obj.snap=false;
        obj.numberOfOpponentCards = snipPlayers[snipSockets.indexOf(ws)+1].getHandCopy().length;
        obj.pileTopCard = null;
        obj.yourCards = snipPlayers[snipSockets.indexOf(ws)].getHandCopy();
        obj.readyToPlay = false;
        snipSockets[snipSockets.indexOf(ws)].send(JSON.stringify(obj));
        //*/
    } else if(snipSockets.indexOf(ws)%2==1){  
        let obj = {};
        obj.action="Snip Snap Snorum";
        obj.status = "You may start the round";
        obj.snip=false;
        obj.snap=false;
        obj.numberOfOpponentCards = snipPlayers[snipSockets.indexOf(ws)-1].getHandCopy().length;
        obj.pileTopCard = null;
        obj.yourCards = snipPlayers[snipSockets.indexOf(ws)].getHandCopy();
        obj.readyToPlay = true;
        snipSockets[snipSockets.indexOf(ws)].send(JSON.stringify(obj));
        //*/
        
        ///*
            //set up for a new game to be played if more players join
                let deck = new Deck();
                deck.shuffle();
                while(deck.isTopCardAnEight()){deck.shuffle();}
                //eightPiles.push(pile);
                snipDecks.push(deck);
                let p1=new Player(deck);
                let p2=new Player(deck);
        
            for(var i=0; i<15; i++){
                p1.add(deck.dealACard());
            }
        
            for(var i=0; i<15; i++){
                p2.add(deck.dealACard());
            }
                
                snipPlayers.push(p1);
                snipPlayers.push(p2);
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
    let odd=false;
    let gamenum=0;
    if(playernumber%2 == 0){
        gamenum=(playernumber)/2;
    }
    else{
        gamenum=(playernumber-1)/2;
        odd=true;
    }
    
    let obj={};
    
    if(odd){
       obj.action="Snip Snap Snorum";
        obj.status="Sorry you lose";
        obj.pileTopCard=snipPile.getTopCard();
        obj.yourCards=snipPlayers[playerNumber-1].getHandCopy();
        obj.snip=false;
        obj.snap=false;
        obj.numberOfOpponentCards=snipPlayers[playerNumber].getHandCopy().length;
        obj.readyToPlay=false;
        snipSockets[playerNumber-1].send(JSON.stringify(obj));
            
        obj.action="Snip Snap Snorum";
        obj.status="Congradulations You win";
        obj.pileTopCard=snipPile.getTopCard();
        obj.yourCards=snipPlayers[playerNumber].getHandCopy();
        obj.snip=false;
        obj.snap=false;
        obj.numberOfOpponentCards=snipPlayers[playerNumber-1].getHandCopy().length;
        obj.readyToPlay=false;
        snipSockets[playerNumber].send(JSON.stringify(obj)); 
    }
    else{
        obj.action="Snip Snap Snorum";
        obj.status="Sorry you lose";
        obj.pileTopCard=snipPile.getTopCard();
        obj.yourCards=snipPlayers[playerNumber+1].getHandCopy();
        obj.snip=false;
        obj.snap=false;
        obj.numberOfOpponentCards=snipPlayers[playerNumber].getHandCopy().length;
        obj.readyToPlay=false;
        snipSockets[playerNumber+1].send(JSON.stringify(obj));
            
        obj.action="Snip Snap Snorum";
        obj.status="Congradulations You win";
        obj.pileTopCard=snipPile.getTopCard();
        obj.yourCards=snipPlayers[playerNumber].getHandCopy();
        obj.snip=false;
        obj.snap=false;
        obj.numberOfOpponentCards=snipPlayers[playerNumber+1].getHandCopy().length;
        obj.readyToPlay=false;
        snipSockets[playerNumber].send(JSON.stringify(obj)); 
    }
    
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
    let gamenum=0;
    if(playernumber%2 == 0){
        gamenum=(playernumber)/2;
    }
    else{
        gamenum=(playernumber-1)/2;
        odd=true;
    }
    
    let obj={};
    
    if(odd){
       obj.action="Snip Snap Snorum";
        obj.status="It is now your turn";
        obj.pileTopCard=snipPile.getTopCard();
        obj.yourCards=snipPlayers[playerNumber-1].getHandCopy();
        obj.snip=snip;
        obj.snap=snap;
        obj.numberOfOpponentCards=snipPlayers[playerNumber].getHandCopy().length;
        obj.readyToPlay=true;
        snipSockets[playerNumber-1].send(JSON.stringify(obj));

    
        obj.action="Snip Snap Snorum";
        obj.status="Please wait for the other player to play";
        obj.pileTopCard=snipPile.getTopCard();
        obj.yourCards=snipPlayers[playerNumber].getHandCopy();
        obj.snip=snip;
        obj.snap=snap;
        obj.numberOfOpponentCards=snipPlayers[playerNumber-1].getHandCopy().length;
        obj.readyToPlay=false;
        snipSockets[playerNumber].send(JSON.stringify(obj)); 
    }else{
        obj.action="Snip Snap Snorum";
        obj.status="It is now your turn";
        obj.pileTopCard=snipPile.getTopCard();
        obj.yourCards=snipPlayers[playerNumber+1].getHandCopy();
        obj.snip=snip;
        obj.snap=snap;
        obj.numberOfOpponentCards=snipPlayers[playerNumber].getHandCopy().length;
        obj.readyToPlay=true;
        snipSockets[playerNumber+1].send(JSON.stringify(obj));
    
        obj.action="Snip Snap Snorum";
        obj.status="Please wait for the other player to play";
        obj.pileTopCard=snipPile.getTopCard();
        obj.yourCards=snipPlayers[playerNumber].getHandCopy();
        obj.snip=snip;
        obj.snap=snap;
        obj.numberOfOpponentCards=snipPlayers[playerNumber+1].getHandCopy().length;
        obj.readyToPlay=false;
        snipSockets[playerNumber].send(JSON.stringify(obj));
    }   
}
/*
if(playernumber%2 ==0) {//Handles a player leaving the game
            obj.numberOfOpponentCards = crazyEightPlayers[1].getHandCopy().length;
            obj.yourCards = crazyEightPlayers[playernumber].getHandCopy();
            obj.readyToPlay = false;
            eightSockets[playernumber+1].send(JSON.stringify(obj));
            eightSockets[playernumber]=null;

    } else if(playernumber%2 ==1){
        obj.status = "You win!! Opponent has forfiet!";
        obj.numberOfOpponentCards = crazyEightPlayers[playernumber-1].getHandCopy().length;
        obj.yourCards = crazyEightPlayers[playernumber].getHandCopy();
        obj.readyToPlay = false;

        eightSockets[playernumber-1].send(JSON.stringify(obj));
        eightSockets[playernumber]=null;
    }
*/
function snipQuit(playernumber){
    let gamenum=0;
    if(playernumber%2 == 0){
        gamenum=(playernumber)/2;
    }
    else{
        gamenum=(playernumber-1)/2;
    }
    
    if(playernumber%2 == 0) {//Handles a player leaving the game
        let obj = {};
        obj.action="Snip Snap Snorum";
        obj.status = "You win!! Opponent has forfeit!";
        obj.numberOfOpponentCards = snipPlayers[playernumber].getHandCopy().length;
        obj.snip=false;
        obj.snap=false;
        obj.pileTopCard = snipPiles[gamenum].getTopCard();
        obj.yourCards = snipPlayers[playernumber+1].getHandCopy();
        obj.readyToPlay = false;
        
        snipSockets[playernumber+1].send(JSON.stringify(obj));
        snipSockets[playernumber]=null;

    } else {
        let obj = {};
        obj.action="Snip Snap Snorum";
        obj.status = "You win!! Opponent has forfeit!";
        obj.numberOfOpponentCards = snipPlayers[playernumber].getHandCopy().length;
        obj.pileTopCard = snipPiles[gamenum].getTopCard();
        obj.snip=false;
        obj.snap=false;
        obj.yourCards = snipPlayers[playernumber-1].getHandCopy();
        obj.readyToPlay = false;

        snipSockets[playernumber-1].send(JSON.stringify(obj));
        snipSockets[playernumber]=null;
    }
}

function playGoFish(message, ws){
    if(message.gameact=="Play"){
        fishPlay(ws);
    }
    else if(message.gameact=="goFish"){
        console.log("Saying Go Fish");
        goFish(message, fishSockets.indexOf(ws));
    }
    else if(message.gameact=="ask for card"){
        console.log("asking the other player for a card");
        askForCard(message, fishSockets.indexOf(ws));
    }
    else if(message.gameact=="Give a card"){
        console.log("Giving a card to the other player");
        giveCard(message,fishSockets.indexOf(ws));
    }
    else if(message.gameact=="find winner"){//can probablt get rid of this
        console.log("Looking at number of four ofs to determine a winner");
    }
    else if(message.gameact=="quit"){
        console.log("Quitting play for go fish");
        quitFish(fishSockets.indexOf(ws));
    }
}

function fishPlay(ws){
    console.log("We are playing Go Fish");
    fishSockets.push(ws);
    let obj = {};
    if(fishSockets.indexOf(ws)%2==0) {
        ///*
        obj.action="Go Fish";
        obj.status = "Waiting for player to join";
        obj.fish=false;
        obj.askCard=null;
        obj.numberOfOpponentCards = fishPlayers[fishSockets.indexOf(ws)+1].getHandCopy().length;
        obj.yourCards = fishPlayers[fishSockets.indexOf(ws)].getHandCopy();
        obj.readyToPlay = false;
        fishSockets[fishSockets.indexOf(ws)].send(JSON.stringify(obj));
        //*/
    } else if(fishSockets.indexOf(ws)%2==1){
        obj.action="Go Fish";
        obj.status = "Your turn";
        obj.fish=true;
        obj.askCard=null;
        obj.numberOfOpponentCards = fishPlayers[fishSockets.indexOf(ws)-1].getHandCopy().length;
        obj.yourCards = fishPlayers[fishSockets.indexOf(ws)].getHandCopy();
        obj.readyToPlay = true;
        fishSockets[fishSockets.indexOf(ws)].send(JSON.stringify(obj));
        //*/
        
        //set up for a new game to be played if more players join
                let deck = new Deck();
                deck.shuffle();
                while(deck.isTopCardAnEight()){deck.shuffle();}
                //eightPiles.push(pile);
                fishDecks.push(deck);
                let p1=new Player(deck);
                let p2=new Player(deck);
        
            for(var i=0; i<15; i++){
                p1.add(deck.dealACard());
                p2.add(deck.dealACard());
            }
                
            fishPlayers.push(p1);
            fishPlayers.push(p2);
    }
}

function goFish(message, playerNumber){//Go Fish player has said go fish
    //let drawCard=fishDeck.dealACard();
    console.log("This many cards left in the deck"+fishDeck.list.length);
    let empty=false;
    let score=false;
    let odd=false;
    let gamenum=0;
    if(playerNumber%2 == 0){
        gamenum=(playerNumber)/2;
    }
    else{
        gamenum=(playerNumber-1)/2;
        odd=true;
    }
    
    let c=null;
    if(fishDeck.list.length==0){
        empty=true;
    }else{
        if(odd){
            fishPlayers[playerNumber-1].add(fishDeck.dealACard());
            c=checkAmount(fishPlayers[playerNumber-1]);    
            if(c!=null){
                score=true;
                fourOfs[playerNumber-1]++;
                console.log((playerNumber) +" Player has this many four ofs " +fourOfs[playerNumber-1]);
            }
        }else{
            fishPlayers[playerNumber+1].add(fishDeck.dealACard());
            c=checkAmount(fishPlayers[playerNumber+1]);    
            if(c!=null){
                score=true;
                fourOfs[playerNumber+1]++;
                console.log((playerNumber) +" Player has this many four ofs " +fourOfs[playerNumber]);
            }
        }
    
    let newHand=fishPlayers[playerNumber].getHandCopy();
    
    if(newHand.length==0){
        console.log("A player's hand is empty");
        console.log("This many cards left in the deck"+fishDeck.list.length);
        var row=0;
        let newHand=new Array();
        while(row<5){
            if(fishDeck.list.length==0){
                break;
            }
            console.log("adding to newHand goFish");
            newHand.push(fishDeck.dealACard());
            row++;
        }
        console.log("This many cards left in the deck"+fishDeck.list.length);
        fishPlayers[playerNumber].setHand(newHand);
    }
    
    //console.log("hand is after");//console.log(newHand);
    if(odd){
        let phand=fishPlayers[playerNumber-1].getHandCopy();
        if(phand.length==0){
            console.log("Other player's hand is empty gofish");
            console.log("This many cards left in the deck"+fishDeck.list.length);
            var row=0;
            phand=new Array();
            while(row<5){
                if(fishDeck.list.length==0){
                    break;
                }
                console.log("adding to phand gofish");
                phand.push(fishDeck.dealACard());
                row++;
            }
            console.log("This many cards left in the deck"+fishDeck.list.length);
            fishPlayers[playerNumber-1].setHand(phand);
        }
    }else{
        let phand=fishPlayers[playerNumber+1].getHandCopy();
        if(phand.length==0){
            console.log("Other player's hand is empty gofish");
            console.log("This many cards left in the deck"+fishDeck.list.length);
            var row=0;
            phand=new Array();
            while(row<5){
                if(fishDeck.list.length==0){
                    break;
                }
                console.log("adding to phand gofish");
                phand.push(fishDeck.dealACard());
                row++;
            }
            console.log("This many cards left in the deck"+fishDeck.list.length);
            fishPlayers[playerNumber+1].setHand(phand);
        }
        //console.log("phand is after");//console.log(phand);
    }
        
    }
    let obj={};
    
    let win=false;
    if(odd){
       if((fishDeck.list.length==0) && (fishPlayers[playerNumber].list.length==0) && (fishPlayers[playerNumber-1].list.length==0)){
        fishWinner(message, playerNumber);
    } 
    }else{
        if((fishDeck.list.length==0) && (fishPlayers[playerNumber].list.length==0) && (fishPlayers[playerNumber+1].list.length==0)){
            fishWinner(message, playerNumber);
            win=true;
        }
    }
    if(!win){
        if(odd){//Handle odd player number
            if(empty){
                obj.status="No Cards found. No cards left to draw";
            }
            else{
                obj.status="No cards found. Drawing a card";
            }
            obj.action="Go Fish";
            obj.yourCards=fishPlayers[playerNumber-1].getHandCopy();
            obj.numberOfOpponentCards=fishPlayers[playerNumber].getHandCopy().length;
            obj.fish=false;
            if(score){
                obj.score=c;
            }
            obj.askCard=null;
            obj.readyToPlay=false;
            fishSockets[playerNumber-1].send(JSON.stringify(obj));
            obj.score=null;
        
        
            if(empty){
                obj.status="No cards left in deck. Choose a card to ask for";
            }
            else{
                obj.status="Choose a card to ask for";
            }
            obj.action="Go Fish";
            obj.yourCards=fishPlayers[playerNumber].getHandCopy();
            obj.numberOfOpponentCards=fishPlayers[playerNumber-1].getHandCopy().length;
            obj.askCard=null;
            if(score){
                obj.comScore=c;
            }
            obj.fish=true;
            obj.readyToPlay=true;
            fishSockets[playerNumber].send(JSON.stringify(obj));
            
        }else{//Handle an even numbered player
            if(empty){
                obj.status="No Cards found. No cards left to draw";
            }
            else{
                obj.status="No cards found. Drawing a card";
            }
            obj.action="Go Fish";
            obj.yourCards=fishPlayers[playerNumber+1].getHandCopy();
            obj.numberOfOpponentCards=fishPlayers[playerNumber].getHandCopy().length;
            obj.fish=false;
            if(score){
                obj.score=c;
            }
            obj.askCard=null;
            obj.readyToPlay=false;
            fishSockets[playerNumber+1].send(JSON.stringify(obj));
            obj.score=null;
        
            if(empty){
                obj.status="No cards left in deck. Choose a card to ask for";
            }
            else{
                obj.status="Choose a card to ask for";
            }
            obj.action="Go Fish";
            obj.yourCards=fishPlayers[playerNumber].getHandCopy();
            obj.numberOfOpponentCards=fishPlayers[playerNumber+1].getHandCopy().length;
            obj.askCard=null;
            if(score){
                obj.comScore=c;
            }
            obj.fish=true;
            obj.readyToPlay=true;
            fishSockets[playerNumber].send(JSON.stringify(obj));
        }
    }
}

function giveCard(message, playerNumber){
    console.log("Giving a card to the opponent");
    let giveCards = message.cardsToGive;
    let tempcards = JSON.parse(JSON.stringify( giveCards ),
            (k,v)=>(typeof v.suit)!=="undefined" ? new Card(v.suit, v.value) : v);
    let hand = message.hand;
    let newHand = JSON.parse(JSON.stringify( hand ),
            (k,v)=>(typeof v.suit)!=="undefined" ? new Card(v.suit, v.value) : v);
    fishPlayers[playerNumber].setHand(newHand);
    let score=false;
    //console.log("hand is");//console.log(newHand);
    let odd=false;
    let gamenum=0;
    if(playerNumber%2 == 0){
        gamenum=(playerNumber)/2;
    }
    else{
        gamenum=(playerNumber-1)/2;
        odd=true;
    }
    let c=null;
    if(newHand.length==0){
        console.log("A player's hand is empty");
        console.log("This many cards left in the deck"+fishDeck.list.length);
        var row=0;
        newHand=new Array();
        while(row<5){
            if(fishDeck.list.length==0){
                break;
            }
            console.log("adding to newHand");
            newHand.push(fishDeck.dealACard());
            row++;
        }
        console.log("This many cards left in the deck"+fishDeck.list.length);
        fishPlayers[playerNumber].setHand(newHand);
    }
    
    //console.log("hand is after");//console.log(newHand);
    if(odd){
        console.log(playerNumber-1);
        console.log(fishPlayers[playerNumber-1]);
        for(var i=0; i<tempcards.length; i++){
            fishPlayers[playerNumber-1].add(tempcards[i]);
        }
        c=checkAmount(fishPlayers[playerNumber-1]);    
        if(c!=null){
            score=true;
            fourOfs[playerNumber-1]++;
            console.log((playerNumber-1) +" Player has this many four ofs " +fourOfs[playerNumber-1]);
        }
    }else{
        for(var i=0; i<tempcards.length; i++){
            fishPlayers[playerNumber+1].add(tempcards[i]);
        }
        c=checkAmount(fishPlayers[playerNumber+1]);    
        if(c!=null){
            score=true;
            fourOfs[playerNumber+1]++;
            console.log((playerNumber+1) +" Player has this many four ofs " +fourOfs[playerNumber+1]);
        }
    }
    
    if(odd){
        let phand=fishPlayers[playerNumber-1].getHandCopy();
        //console.log("phand is");//console.log(phand);
        if(phand.length==0){
            console.log("Other player's hand is empty");
            console.log("This many cards left in the deck"+fishDeck.list.length);
            var row=0;
            phand=new Array();
            while(row<5){
                if(fishDeck.list.length==0){
                    break;
                }
                console.log("adding to phand");
                phand.push(fishDeck.dealACard());
                row++;
            }
            console.log("This many cards left in the deck"+fishDeck.list.length);
            fishPlayers[playerNumber-1].setHand(phand);
        }
        //console.log("phand is after");//console.log(phand);
    }else{
        let phand=fishPlayers[playerNumber+1].getHandCopy();
        //console.log("phand is");//console.log(phand);
        if(phand.length==0){
            console.log("Other player's hand is empty");
            console.log("This many cards left in the deck"+fishDeck.list.length);
            var row=0;
            phand=new Array();
            while(row<5){
                if(fishDeck.list.length==0){
                    break;
                }
                console.log("adding to phand");
                phand.push(fishDeck.dealACard());
                row++;
            }
            console.log("This many cards left in the deck"+fishDeck.list.length);
            fishPlayers[playerNumber+1].setHand(phand);
        }
        //console.log("phand is after");//console.log(phand);
    }
    let win=false;
    if(odd){
       if((fishDecks[gamenum].list.length==0) && (fishPlayers[playerNumber].list.length==0) && (fishPlayers[playerNumber-1].list.length==0)){
        fishWinner(message, playerNumber);
    } 
    }else{
        if((fishDecks[gamenum].list.length==0) && (fishPlayers[playerNumber].list.length==0) && (fishPlayers[playerNumber+1].list.length==0)){
            fishWinner(message, playerNumber);
            win=true;
        }
    }
    
    if(!win){
        let obj={};
        if(odd){//handle an odd player number
            obj.action="Go Fish";
            obj.status="Recieving cards";
            obj.yourCards=fishPlayers[playerNumber-1].getHandCopy();
            obj.numberOfOpponentCards=fishPlayers[playerNumber].getHandCopy().length;
            obj.fish=false;
            if(score){
                obj.score=c;
            }
            obj.askCard=null;
            obj.readyToPlay=false;
            fishSockets[playerNumber-1].send(JSON.stringify(obj));
            obj.score=null;
    
            obj.action="Go Fish";
            obj.status="Cards sent. Choose a card to ask for";
            obj.yourCards=fishPlayers[playerNumber].getHandCopy();
            obj.numberOfOpponentCards=fishPlayers[playerNumber-1].getHandCopy().length;
            obj.askCard=null;
            if(score){
                obj.comScore=c;
            }
            obj.fish=true;
            obj.readyToPlay=true;
            fishSockets[playerNumber].send(JSON.stringify(obj));
            
        }else{//Handle an even player number
            obj.action="Go Fish";
            obj.status="Recieving cards";
            obj.yourCards=fishPlayers[playerNumber+1].getHandCopy();
            obj.numberOfOpponentCards=fishPlayers[playerNumber].getHandCopy().length;
            obj.fish=false;
            if(score){
                obj.score=c;
            }
            obj.askCard=null;
            obj.readyToPlay=false;
            fishSockets[playerNumber+1].send(JSON.stringify(obj));
            obj.score=null;
    
            obj.action="Go Fish";
            obj.status="Cards sent. Choose a card to ask for";
            obj.yourCards=fishPlayers[playerNumber].getHandCopy();
            obj.numberOfOpponentCards=fishPlayers[playerNumber+1].getHandCopy().length;
            obj.askCard=null;
            if(score){
                obj.comScore=c;
            }
            obj.fish=true;
            obj.readyToPlay=true;
            fishSockets[playerNumber].send(JSON.stringify(obj));
        }
        
    }
}

function askForCard(message, playerNumber){
    console.log("Asking the opponent for a card");
    let askCard=message.askCard;
    let tempCard = new Card(askCard.suit, askCard.value);
    let hand = message.hand;
    let newHand = JSON.parse(JSON.stringify( hand ),
            (k,v)=>(typeof v.suit)!=="undefined" ? new Card(v.suit, v.value) : v);
    
    fishPlayers[playerNumber].setHand(hand);
    let gamenum=0;
    let odd=0;
    
    if(playerNumber%2 == 0){
        gamenum=(playerNumber)/2;
    }
    else{
        gamenum=(playerNumber-1)/2;
        odd=true;
    }
    
    let obj={};
    
    if(odd){//Handle odd player number
        obj.action="Go Fish";
        obj.status="Do you have any "+ tempCard.getValue()+"'s";
        obj.yourCards=fishPlayers[playerNumber-1].getHandCopy();
        obj.numberOfOpponentCards=fishPlayers[playerNumber].getHandCopy().length;
        obj.fish=false;
        obj.askCard=tempCard;
        obj.readyToPlay=true;
        fishSockets[playerNumber-1].send(JSON.stringify(obj));

        obj.action="Go Fish";
        obj.status="Seeing if other player has your card";
        obj.yourCards=fishPlayers[playerNumber].getHandCopy();
        obj.numberOfOpponentCards=fishPlayers[playerNumber-1].getHandCopy().length;
        obj.askCard=null;
        obj.fish=false;
        obj.readyToPlay=false;
        fishSockets[playerNumber].send(JSON.stringify(obj)); 
    }else{//Handle even player number
        obj.action="Go Fish";
        obj.status="Do you have any "+ tempCard.getValue()+"'s";
        obj.yourCards=fishPlayers[playerNumber+1].getHandCopy();
        obj.numberOfOpponentCards=fishPlayers[playerNumber].getHandCopy().length;
        obj.fish=false;
        obj.askCard=tempCard;
        obj.readyToPlay=true;
        fishSockets[playerNumber+1].send(JSON.stringify(obj));
    
        obj.action="Go Fish";
        obj.status="Seeing if other player has your card";
        obj.yourCards=fishPlayers[playerNumber].getHandCopy();
        obj.numberOfOpponentCards=fishPlayers[playerNumber+1].getHandCopy().length;
        obj.askCard=null;
        obj.fish=false;
        obj.readyToPlay=false;
        fishSockets[playerNumber].send(JSON.stringify(obj));
    }
    
}

function fishWinner(message, playerNumber){
    console.log("Calculating the winner");
    let obj={};
    let gamenum=0;
    let odd=false;
    
    if(playerNumber%2 == 0){
        gamenum=(playerNumber)/2;
    }
    else{
        gamenum=(playerNumber-1)/2;
        odd=true;
    }
    
    if(odd){//handle an odd number player
        if(fourOfs[playerNumber-1]>fourOfs[playerNumber]){
            obj.action="Go Fish";
            obj.status="You win!";
            obj.yourCards=fishPlayers[playerNumber-1].getHandCopy();
            obj.numberOfOpponentCards=fishPlayers[playerNumber].getHandCopy().length;
            obj.fish=false;
            obj.askCard=null;
            obj.readyToPlay=false;
            fishSockets[playerNumber-1].send(JSON.stringify(obj));
    
            obj.action="Go Fish";
            obj.status="Sorry You lose!";
            obj.yourCards=fishPlayers[playerNumber].getHandCopy();
            obj.numberOfOpponentCards=fishPlayers[playerNumber-1].getHandCopy().length;
            obj.askCard=null;
            obj.fish=true;
            obj.readyToPlay=false;
            fishSockets[playerNumber].send(JSON.stringify(obj));
        }
        else{
            obj.action="Go Fish";
            obj.status="Sorry You Lose!";
            obj.yourCards=fishPlayers[playerNumber-1].getHandCopy();
            obj.numberOfOpponentCards=fishPlayers[playerNumber].getHandCopy().length;
            obj.fish=false;
            obj.askCard=null;
            obj.readyToPlay=false;
            fishSockets[playerNumber-1].send(JSON.stringify(obj));
    
            obj.action="Go Fish";
            obj.status="You win!";
            obj.yourCards=fishPlayers[playerNumber].getHandCopy();
            obj.numberOfOpponentCards=fishPlayers[playerNumber-1].getHandCopy().length;
            obj.askCard=null;
            obj.fish=true;
            obj.readyToPlay=false;
            fishSockets[playerNumber].send(JSON.stringify(obj));
        }
        
    }else{//Handle even number player
       if(fourOfs[playerNumber+1]>fourOfs[playerNumber]){
            obj.action="Go Fish";
            obj.status="You win!";
            obj.yourCards=fishPlayers[playerNumber+1].getHandCopy();
            obj.numberOfOpponentCards=fishPlayers[playerNumber].getHandCopy().length;
            obj.fish=false;
            obj.askCard=null;
            obj.readyToPlay=false;
            fishSockets[playerNumber+1].send(JSON.stringify(obj));
    
            obj.action="Go Fish";
            obj.status="Sorry You lose!";
            obj.yourCards=fishPlayers[playerNumber].getHandCopy();
            obj.numberOfOpponentCards=fishPlayers[playerNumber+1].getHandCopy().length;
            obj.askCard=null;
            obj.fish=true;
            obj.readyToPlay=false;
            fishSockets[playerNumber].send(JSON.stringify(obj));
        }
        else{
            obj.action="Go Fish";
            obj.status="Sorry You Lose!";
            obj.yourCards=fishPlayers[playerNumber+1].getHandCopy();
            obj.numberOfOpponentCards=fishPlayers[playerNumber].getHandCopy().length;
            obj.fish=false;
            obj.askCard=null;
            obj.readyToPlay=false;
            fishSockets[playerNumber+1].send(JSON.stringify(obj));
    
            obj.action="Go Fish";
            obj.status="You win!";
            obj.yourCards=fishPlayers[playerNumber].getHandCopy();
            obj.numberOfOpponentCards=fishPlayers[playerNumber+1].getHandCopy().length;
            obj.askCard=null;
            obj.fish=true;
            obj.readyToPlay=false;
            fishSockets[playerNumber].send(JSON.stringify(obj));
        }
    }
}

function checkAmount(player){
    let hand=player.getHandCopy();
    let newHand = JSON.parse(JSON.stringify( hand ),
                            (k,v)=>(typeof v.suit)!=="undefined" ? new Card(v.suit, v.value) : v);
    var total=0;
        
    for(var i=0; i<newHand.length; i++){
        total=countCard(newHand[i],player);
        if(total==4){
            let card=newHand[i];
            while(true){
                let hand=player.getHandCopy();
                let Hands = JSON.parse(JSON.stringify( hand ),
                            (k,v)=>(typeof v.suit)!=="undefined" ? new Card(v.suit, v.value) : v);
                //console.log("In while loop");
                for(var j=0; j<Hands.length; j++){
                 //console.log("In for loop");
                    if(Hands[j].getValue() == card.getValue()){
                        //console.log("Removing card at pos "+j);
                        player.remove(j);
                        removed=true;
                        break;
                        }
                    }
                    if(!removed){
                        break;
                    }
                    removed=false;
                }
                return card;
            }
        }
        return null;
    }
    
    /*Find the duplicates in a hand*/
   function countCard(card,player){//Count occurences of a single card
        let hand=player.getHandCopy();
       let newHand = JSON.parse( JSON.stringify( hand ),
                            (k,v)=>(typeof v.suit)!=="undefined" ? new Card(v.suit, v.value) : v);
        var tot=0;
        for(let i=0; i<newHand.length; i++){
            if(newHand[i].getValue()==card.getValue()){
                tot++;
            }
        }
        //alert("total ="+tot);
        return tot;
    }

function quitFish(playernumber){
    console.log("Quitting Go Fish");
    if(playernumber==0) {//Handles a player leaving the game
        let obj = {};
        obj.action="Go Fish";
        obj.status = "You win!! Opponent has forfeit!";
        obj.numberOfOpponentCards = fishPlayers[1-playernumber].getHandCopy().length;
        obj.askCard=null;
        obj.yourCards = fishPlayers[playernumber].getHandCopy();
        obj.readyToPlay = false;
        
        webSockets[1].send(JSON.stringify(obj));

    } else if(playernumber==1){
        let obj = {};
        obj.action="Go Fish";
        obj.status = "You win!! Opponent has forfeit!";
        obj.numberOfOpponentCards = fishPlayers[1-playernumber].getHandCopy().length;
        obj.askCard=null;
        obj.yourCards = fishPlayers[playernumber].getHandCopy();
        obj.readyToPlay = false;

        webSockets[0].send(JSON.stringify(obj));
    }
}