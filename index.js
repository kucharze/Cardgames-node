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

const Uploader = require('./public/Online/Upload.js');

const LoginHandler = require('./public/Online/LoginHandler.js');

let upload = new Uploader();

//neccesities to play Crazy eights
let crazyGames=0;
let eightDecks=[];
let eightComplete=[];
eightComplete.push(false);
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
let snipComplete=[];
let snipPile=new Pile();
let snipDeck=new Deck();
snipDeck.shuffle();
snipDeck.shuffle();
snipComplete.push(false);
snipPiles.push(snipPile);
snipDecks.push(snipDeck);

let snipPlayers=[];
let snipSockets=[];//websockets playing sss online

snipPlayers.push(new Player(snipDeck));
snipPlayers.push(new Player(snipDeck));

for(var i=0; i<17; i++){
    snipPlayers[0].list.push(snipDeck.dealACard());
    snipPlayers[1].list.push(snipDeck.dealACard());
}

//Go Fish necessities
let fishDecks=[];
let fishComplete=[];
let fishDeck=new Deck();
fishDeck.shuffle();
fishDeck.shuffle();

fishDecks.push(fishDeck);
let fishPlayers=[];
let fishSockets=[];
let fourOfs=[];

fishComplete.push(false);
fourOfs.push(0);
fourOfs.push(0);

fishPlayers.push(new Player(fishDeck));
fishPlayers.push(new Player(fishDeck));

//below temporary for testing
/*
for(var i=0; i<12; i++){
    fishPlayers[0].add(fishDeck.dealACard());
    fishPlayers[1].add(fishDeck.dealACard());
}*/

//init Express
var app = express();
//init Express Router
var router = express.Router();
var port = process.env.PORT || 8080;
app.use(express.static(path.join(__dirname,'/public')));

let webSockets=[];
//let clientcounter=0;

//init mongodb for use of database
//var MongoClient=require('mongodb').MongoClient;
//var database=null;
//var url = "mongodb://localhost:27017/mydb";//on local machine

//Removed database link since site got removed
//var url = "mongodb://admin:Javaking23@ds159631.mlab.com:59631/node_deploy";
//var url = "mongodb+srv://admin:Zekxlr8323%21@node-deploy.z0pjs.mongodb.net/?retryWrites=true&w=majority";
//localhost:27017/cardgames";

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://admin:Zekxlr8323%21@node-deploy.z0pjs.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

//return static page with websocket client
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index-new.html'));
});
var server = app.listen(port, function () {
    console.log('node.js static server listening on port: ' + port + ", with websockets listener")
})
const ws = new SocketServer({ server });
//init Websocket ws and handle incoming connect requests
ws.on('connection', function connection(ws) {
    console.log("Sucessful connection");
    
    if(!webSockets.includes(ws)) {
        ws.logedIn=logedin;
        ws.login="";
        webSockets.push(ws);
    }
    //on connect message
    ws.on('message', function incoming(message) {
        let userMess = JSON.parse(message);
        
        //take an action based on the action of the message
        //console.log("action="+userMess.action);
        if(userMess.action=="create"){
            createlogin(userMess,ws);
        }
        else if(userMess.action=="login"){
            login(userMess,ws);
        }
        else if(userMess.action=="Crazy Eights"){
            console.log("Going to Crazy Eights");
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
        else if(userMess.action=="Suggest"){
            console.log("Making a suggestion");
            suggest(userMess);
        }
        else if(userMess.action=="Blackjack"){
            console.log("Making an update to the Blackjack database - Temporarily disabled");
            //upload.jackUpload(userMess,ws,webSockets);
        }
        else if(userMess.action=="War"){
            console.log("Making an update to the war database - Temporarily disabled");
            //upload.warUpload(userMess,ws);
        }
        else if(userMess.action=="Spider Solitare"){
            console.log("Making an update to the Spider Solitare database - Temporarily disabled");
            //upload.spiderUpload(userMess,ws);
        }
        else if(userMess.action=="Match"){
            console.log("Making an update to the Matching database - Temporarily disabled");
            //upload.matchUpload(userMess,ws);
        }
        else if(userMess.action=="Leaderboard"){
            console.log("Loading a leaderboard to send to the user - Temporarily disabled");
            //upload.loadLeadeboardloadLeadeboard(userMess,ws);
        }
        else if(userMess.action=="ping"){
            //console.log("Recieved a ping");
        }
        else if(userMess.action=="message"){//Used for debugging
            Console.log("Displaying a message");
            console.log(userMess.mess);
        }
    });
    ws.on('close',function close(){
        //ws.send(JSON.stringify({action:"Bye"}));
        console.log("user is disconnecting");
        //Remove user websocket from all games if in any
        let index=eightSockets.indexOf(ws);
        if(index!=-1){
            eightQuit(index);
        }
        
        index=snipSockets.indexOf(ws);
        if(index!=-1){
            snipQuit(index);
        }
        
        index=fishSockets.indexOf(ws);
        
        if(index!=-1){
            quitFish(index);
        }
        
        index=webSockets.indexOf(ws);
        if(index!=-1){
            webSockets.splice(index,1);
        }
        cleanUp();
    });
});

function cleanUp(){
    console.log("Attempting a clean up");
    //go through game arrays and delete all unnecessary
    for(var i =0; i<eightDecks.length; i++){
        let playspot=(i*2);
        if(eightSockets.length  > 0){
            if(eightSockets[playspot]==null || eightSockets[playspot+1]==null){
                console.log("removing Crazy Eights Necessities");
                eightDecks.splice(i,1);
                eightPiles.splice(i,1);
                eightComplete.splice(i,1);
                crazyEightPlayers.splice(playspot,2);
                eightSockets.splice(playspot,2);
            }  
        }

    }
    if(eightDecks.length==0){//no game essentials left
        let deck = new Deck();
            deck.shuffle();
            while(deck.isTopCardAnEight()){deck.shuffle();}
            let pile=new Pile();
            pile.acceptACard(deck.dealACard());
            eightPiles.push(pile);
            eightDecks.push(deck);
            eightComplete.push(false);
            
            crazyEightPlayers.push(new Player(deck));
            crazyEightPlayers.push(new Player(deck));
    }
    
    for(var i =0; i<snipDecks.length; i++){
        let playspot=(i*2);
        if(snipSockets.length > 0){
            if(snipSockets[playspot]==null || snipSockets[playspot+1]==null){
                console.log("removing Snip Snap Snorum Necessities");
                snipPiles.splice(i,1);
                snipDecks.splice(i,1);
                snipComplete.splice(i,1);
                snipPlayers.splice(playspot,2);
                snipSockets.splice(playspot,2);
            }            
        }

    }
    if(snipDecks.length==0){//no game essentials left
        let deck = new Deck();
        deck.shuffle();
        while(deck.isTopCardAnEight()){deck.shuffle();}
        let pile=new Pile();
        pile.acceptACard(deck.dealACard());
            
        let p1=new Player(deck);
        let p2=new Player(deck);
        
        for(var i=0; i<16; i++){
            p1.add(deck.dealACard());
            p2.add(deck.dealACard());
        }
            snipPiles.push(pile);
            snipDecks.push(deck);
            snipPlayers.push(p1);
            snipPlayers.push(p2);
            snipComplete.push(false);
    }
    
    for(var i =0; i<fishDecks.length; i++){
        let playspot=(i*2);
        if(fishSockets.length > 0){
            if(fishSockets[playspot]==null || fishSockets[playspot+1]==null){
                console.log("removing Go Fish Necessities");
                fishDecks.splice(i,1);
                fishComplete.splice(i,1);
                fishPlayers.splice(playspot,2);
                fishSockets.splice(playspot,2);
            }          
        }

    }
    
    if(fishDecks.length==0){//no game essentials left
        let deck = new Deck();
        deck.shuffle();
        deck.shuffle();
        
        let p1=new Player(deck);
        let p2=new Player(deck);
        
        for(var i=0; i<16; i++){
            p1.add(deck.dealACard());
            p2.add(deck.dealACard());
        }
        fishDecks.push(deck);
            
        fishPlayers.push(p1);
        fishPlayers.push(p2);
        fishComplete.push(false);
    }
    
}

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

/*
Options that can take place while playing Crazy Eights
Options can be either online or offline
*/
function crazyEights(message,ws){
    console.log("We are playing Crazy eights");
    /*
    if(eightSockets.indexOf(ws) == 0){
        gamenum=(playerNumber)/2;
        otherplayerNumber=playerNumber-1;
    }else{
        gamenum=(playerNumber-1)/2;
        odd=true;
        otherplayerNumber=playerNumber+1;
    }
    */
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
        eightQuit(eightSockets.indexOf(ws));
    }
    /*
    else if(message.gameact=="record"){
        //record data from offline into the database
        console.log("Recoding into Crazy Eights database");
        Uploader.eightRecord(message,ws)
    }*/
}

function eightsPlay(ws){
    eightSockets.push(ws);
    let index=eightSockets.indexOf(ws);
    let gamenum=0;

    //determine which game to play
    if(index%2 == 0){
        gamenum=(index)/2;
    }
    else{
        gamenum=(index-1)/2;
    }
        if(index%2==0) {
            let obj = {};
            obj.action="Crazy Eights";
            obj.status = "Waiting for player to join";
            obj.numberOfOpponentCards = crazyEightPlayers[index+1].getHandCopy().length;
            obj.pileTopCard = eightPiles[gamenum].getTopCard();
            obj.pileAnnouncedSuit = eightPiles[gamenum].getAnnouncedSuit();
            obj.yourCards = crazyEightPlayers[index].getHandCopy();
            obj.readyToPlay = false;
            
            eightSockets[index].send(JSON.stringify(obj));

    } else if(index%2==1){
    //Make adjustments in case this is first player in a new game
        
            let obj = {};
            obj.action="Crazy Eights";
            obj.status = "Your turn";
            obj.numberOfOpponentCards = crazyEightPlayers[index-1].getHandCopy().length;
            obj.pileTopCard = eightPiles[gamenum].getTopCard();
            obj.pileAnnouncedSuit = eightPiles[gamenum].getAnnouncedSuit();
            obj.yourCards = crazyEightPlayers[index].getHandCopy();
            obj.readyToPlay = true;

            eightSockets[eightSockets.indexOf(ws)].send(JSON.stringify(obj));
        
         ///*
            //set up for a new game to be played if more players join
                let deck = new Deck();
                deck.shuffle();
                while(deck.isTopCardAnEight()){deck.shuffle();}
                let pile=new Pile();
                pile.acceptACard(deck.dealACard());
                eightPiles.push(pile);
                eightDecks.push(deck);
                eightComplete.push(false);
                
                crazyEightPlayers.push(new Player(deck));
                crazyEightPlayers.push(new Player(deck));
            
           //*/
        }
}
///*
function cardSelected(message, playerNumber){
    let announcedSuit = message.announcedSuit;
    let card = message.card;
    let tempCard = new Card(card.suit, card.value);
    let hand = crazyEightPlayers[playerNumber].getHandCopy();
    let gamenum=0;
    let otherplayerNumber = 0;
    
    if(playerNumber%2 == 0){
        gamenum=(playerNumber)/2;
        otherplayerNumber=(playerNumber+1);
    }else{
        gamenum=(playerNumber-1)/2;
        otherplayerNumber=(playerNumber-1);
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
    
        if(crazyEightPlayers[playerNumber].isHandEmpty()) {
            //console.log("odd player wins");
            obj.action="Crazy Eights";
            obj.status = "Congratulations, You won";
            obj.numberOfOpponentCards = crazyEightPlayers[otherplayerNumber].getHandCopy().length;
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
            obj.yourCards = crazyEightPlayers[otherplayerNumber].getHandCopy();
            obj.readyToPlay = false;

            eightSockets[otherplayerNumber].send(JSON.stringify(obj));
            eightComplete[gamenum]=true;
            
        }else if(crazyEightPlayers[otherplayerNumber].isHandEmpty()) {
           // console.log("odd player's opponent wins");
            obj.action="Crazy Eights";
            obj.status = "Congratulations, You won";
            obj.numberOfOpponentCards = crazyEightPlayers[otherplayerNumber].getHandCopy().length;
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

            eightSockets[otherplayerNumber].send(JSON.stringify(obj));
            eightComplete[gamenum]=true;
    }else{//console.log("odd player, no winners yet");
            obj.action="Crazy Eights";
            obj.status = "Waiting for opponent to play";
            obj.numberOfOpponentCards = crazyEightPlayers[playerNumber-1].getHandCopy().length;
            obj.pileTopCard = eightPiles[gamenum].getTopCard();
            obj.pileAnnouncedSuit = eightPiles[gamenum].getAnnouncedSuit();
            obj.yourCards = crazyEightPlayers[playerNumber].getHandCopy();
            obj.readyToPlay = false;

            eightSockets[playerNumber].send(JSON.stringify(obj));
    
            obj.action="Crazy Eights";
            obj.status = "Your turn. Suit is "+eightPiles[gamenum].getAnnouncedSuit();
            obj.numberOfOpponentCards = crazyEightPlayers[playerNumber].getHandCopy().length;
            obj.pileTopCard = eightPiles[gamenum].getTopCard();
            obj.pileAnnouncedSuit = eightPiles[gamenum].getAnnouncedSuit();
            obj.yourCards = crazyEightPlayers[otherplayerNumber].getHandCopy();
            obj.readyToPlay = true;

            eightSockets[otherplayerNumber].send(JSON.stringify(obj)); 
      }
}

function cardPicked(playerNumber){
    let otherplayerNumber = 0;
    
    if(playerNumber%2 == 0){
        gamenum=(playerNumber)/2;
        otherplayerNumber=(playerNumber+1);
    }else{
        gamenum=(playerNumber-1)/2;
        otherplayerNumber=(playerNumber-1);
    }
    
    let Eight = eightDecks[gamenum].isTopCardAnEight();
    let drawnCard = eightDecks[gamenum].dealACard();
    crazyEightPlayers[playerNumber].add(drawnCard);

    let obj = {};
    
    obj.action="Crazy Eights";
    obj.procedure="cardPicked";
    obj.drawCard=drawnCard;
    obj.status = "You selected card " + drawnCard.getValue() + drawnCard.getSuit();
    obj.numberOfOpponentCards = crazyEightPlayers[otherplayerNumber].getHandCopy().length;
    obj.pileTopCard = eightPiles[gamenum].getTopCard();
    obj.pileAnnouncedSuit = eightPiles[gamenum].getAnnouncedSuit();
    obj.yourCards = crazyEightPlayers[playerNumber].getHandCopy();
    obj.readyToPlay = false;
    eightSockets[playerNumber].send(JSON.stringify(obj));

    obj.action="Crazy Eights";
    obj.procedure="cardPicked";
    obj.drawCard=null;
    obj.status = "Your turn. Suit is: " + eightPile.getAnnouncedSuit();
    obj.numberOfOpponentCards = crazyEightPlayers[playerNumber].getHandCopy().length;
    obj.pileTopCard = eightPiles[gamenum].getTopCard();
    obj.pileAnnouncedSuit = eightPiles[gamenum].getAnnouncedSuit();
    obj.yourCards = crazyEightPlayers[otherplayerNumber].getHandCopy();
    obj.readyToPlay = true;

    eightSockets[otherplayerNumber].send(JSON.stringify(obj));
    
}

function eightQuit(playernumber){
    console.log("quitting Grazy Eights");
    console.log(playernumber);
    if(playernumber%2 == 0){
        gamenum=(playernumber)/2;
    }
    else{
        gamenum=(playernumber-1)/2;
    }
    
    if(playernumber%2 ==0) {//Handles a player leaving the game
        console.log("even player");
        let obj = {};
        if(eightSockets[+playernumber + +1]!=null && !eightComplete[gamenum]){
            obj.action="Crazy Eights";
            obj.status = "You win!! Opponent has left the game!";
            obj.numberOfOpponentCards = crazyEightPlayers[playernumber+1].getHandCopy().length;
            obj.pileTopCard = eightPiles[gamenum].getTopCard();
            obj.pileAnnouncedSuit = eightPiles[gamenum].getAnnouncedSuit();
            obj.yourCards = crazyEightPlayers[playernumber].getHandCopy();
            obj.readyToPlay = false;
        
            eightSockets[playernumber+1].send(JSON.stringify(obj));
        }
            
            eightSockets[playernumber]=null;

    } else if(playernumber%2 ==1 && !eightComplete[gamenum]){
        console.log("odd player");
        let obj = {};
        if(eightSockets[+playernumber - +1]!=null){
            obj.action="Crazy Eights";
            obj.status = "You win!! Opponent has left the game!";
            obj.numberOfOpponentCards = crazyEightPlayers[playernumber-1].getHandCopy().length;
            obj.pileTopCard = eightPiles[gamenum].getTopCard();
            obj.pileAnnouncedSuit = eightPiles[gamenum].getAnnouncedSuit();
            obj.yourCards = crazyEightPlayers[playernumber].getHandCopy();
            obj.readyToPlay = false;
            
           eightSockets[playernumber-1].send(JSON.stringify(obj)); 
        }
        eightSockets[playernumber]=null;
    }
    eightComplete[gamenum]=true;
    cleanUp();
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
    else if(message.gameact=="update"){
        console.log("Updating info for the other player");
        update(message,snipSockets.indexOf(ws));
    }
    else if(message.gameact=="quit"){
        console.log("Quitting snip snap snorum");
        snipQuit(snipSockets.indexOf(ws));
    }
    /*
    else if(message.gameact=="record"){
        console.log("We are recording a result to the database");
        Uploader.snipRecord(message,ws);
    }*/
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
        
        ///*
            //set up for a new game to be played if more players join
                let deck = new Deck();
                deck.shuffle();
                deck.shuffle();
                deck.shuffle();
                //eightPiles.push(pile);
                snipDecks.push(deck);
                let p1=new Player(deck);
                let p2=new Player(deck);
        
            for(var i=0; i<16; i++){
                p1.add(deck.dealACard());
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
    let gamenum=0;
    let otherplayerNumber = 0;
    
    if(playerNumber%2 == 0){
        gamenum=(playerNumber)/2;
        otherplayerNumber=(playerNumber+1);
    }else{
        gamenum=(playerNumber-1)/2;
        otherplayerNumber=(playerNumber-1);
    }
    
    let obj={};
    
       obj.action="Snip Snap Snorum";
        obj.status="Sorry you lose";
        obj.pileTopCard=snipPile.getTopCard();
        obj.yourCards=snipPlayers[otherplayerNumber].getHandCopy();
        obj.snip=false;
        obj.snap=false;
        obj.numberOfOpponentCards=snipPlayers[playerNumber].getHandCopy().length;
        obj.readyToPlay=false;
        snipSockets[otherplayerNumber].send(JSON.stringify(obj));
            
        obj.action="Snip Snap Snorum";
        obj.status="Congratulations You win";
        obj.pileTopCard=snipPile.getTopCard();
        obj.yourCards=snipPlayers[playerNumber].getHandCopy();
        obj.snip=false;
        obj.snap=false;
        obj.numberOfOpponentCards=snipPlayers[otherplayerNumber].getHandCopy().length;
        obj.readyToPlay=false;
        snipSockets[playerNumber].send(JSON.stringify(obj));
        snipComplete[gamenum]==true;
    
}

function update(message, playerNumber){
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
    let otherplayerNumber = 0;
    
    if(playerNumber%2 == 0){
        gamenum=(playerNumber)/2;
        otherplayerNumber=(playerNumber+1);
    }else{
        gamenum=(playerNumber-1)/2;
        otherplayerNumber=(playerNumber-1);
    }
    
    let obj={};
    //console.log("Player number is "+playerNumber);
       obj.action="Snip Snap Snorum";
        obj.gameact="update";
        obj.pileTopCard=snipPile.getTopCard();
        obj.yourCards=snipPlayers[otherplayerNumber].getHandCopy();
        obj.snip=snip;
        obj.snap=snap;
        obj.numberOfOpponentCards=snipPlayers[playerNumber].getHandCopy().length;
        obj.readyToPlay=false;
        snipSockets[otherplayerNumber].send(JSON.stringify(obj));
    
        obj.action="Snip Snap Snorum";
        obj.status="Please wait for the other player to play";
        obj.pileTopCard=snipPile.getTopCard();
        obj.yourCards=snipPlayers[playerNumber].getHandCopy();
        obj.snip=snip;
        obj.snap=snap;
        obj.numberOfOpponentCards=snipPlayers[otherplayerNumber].getHandCopy().length;
        obj.readyToPlay=false;
        snipSockets[playerNumber].send(JSON.stringify(obj)); 
      
}

function switchUser(message, playerNumber){
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
    let otherplayerNumber = 0;
    
    if(playerNumber%2 == 0){
        gamenum=(playerNumber)/2;
        otherplayerNumber=(playerNumber+1);
    }else{
        gamenum=(playerNumber-1)/2;
        otherplayerNumber=(playerNumber-1);
    }
    
    let obj={};
    //console.log("Player number is "+playerNumber);
       obj.action="Snip Snap Snorum";
        obj.status="It is now your turn";
        obj.pileTopCard=snipPile.getTopCard();
        obj.yourCards=snipPlayers[otherplayerNumber].getHandCopy();
        obj.snip=snip;
        obj.snap=snap;
        obj.numberOfOpponentCards=snipPlayers[playerNumber].getHandCopy().length;
        obj.readyToPlay=true;
        snipSockets[otherplayerNumber].send(JSON.stringify(obj));
    
        obj.action="Snip Snap Snorum";
        obj.status="Please wait for the other player to play";
        //obj.pileTopCard=snipPile.getTopCard();
        obj.yourCards=snipPlayers[playerNumber].getHandCopy();
        obj.snip=snip;
        obj.snap=snap;
        obj.numberOfOpponentCards=snipPlayers[otherplayerNumber].getHandCopy().length;
        obj.readyToPlay=false;
        snipSockets[playerNumber].send(JSON.stringify(obj)); 
    
}

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
        if(snipSockets[playernumber+1]!=null && !snipComplete[gamenum]){
            obj.action="Snip Snap Snorum";
            obj.status = "You win!! Opponent has left the game!";
            obj.numberOfOpponentCards = snipPlayers[playernumber].getHandCopy().length;
            obj.snip=false;
            obj.snap=false;
            //obj.pileTopCard = snipPiles[gamenum].getTopCard();
            obj.yourCards = snipPlayers[playernumber+1].getHandCopy();
            obj.readyToPlay = false;
       
            snipSockets[playernumber+1].send(JSON.stringify(obj));
        }
        snipSockets[playernumber]=null;

    } else {
        let obj = {};
        if(snipSockets[playernumber-1]!=null && !snipComplete[gamenum]){
            obj.action="Snip Snap Snorum";
            obj.status = "You win!! Opponent has left the game!";
            obj.numberOfOpponentCards = snipPlayers[playernumber].getHandCopy().length;
            //obj.pileTopCard = snipPiles[gamenum].getTopCard();
            obj.snip=false;
            obj.snap=false;
            obj.yourCards = snipPlayers[playernumber-1].getHandCopy();
            obj.readyToPlay = false;
        
            snipSockets[playernumber-1].send(JSON.stringify(obj));
        }
        snipSockets[playernumber]=null;
    }
    snipComplete[gamenum]==true;
    cleanUp();
}

//go fish
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
    /*
    else if(message.gameact=="record"){
        console.log("Recording a go fish result");
        fishRecord(message,ws);
    }*/
}
/*
function fishRecord(message, ws){
    let index=webSockets.indexOf(ws);
    if((webSockets[index].username=="") || (webSockets[index].username==null)){
        console.log("Fish Not logged in. Cannot record result");
        let obj={};
        obj.action="Go Fish";
        obj.message="You are not logged in, you cannot record a result to the leaderboard";
        ws.send(JSON.stringify(obj));
        return;
    }
    else{
        var query={screenname: webSockets[index].username};
    }
    
    database.collection("Go Fish fours").find(query).toArray(function(err, result) {
        if (err) throw err;
        if(result.length>0){
            console.log("Entry already exists");
            /////////
            if(result[0].fours < message.four){
                var newvalues = {$set: {screenname: webSockets[index].username, fours: message.fours}};
                database.collection("Go Fish fours").updateOne(query, newvalues, function(err, res) {
                    if (err) throw err;
                    console.log("1 Go Fish moves document updated");
                });
            }
        }
        else{
            query={screenname: webSockets[index].username, fours: message.fours};
            database.collection("Go Fish fours").insertOne(query, function(err, res) {
                if (err) throw err;
                console.log("1 Go Fish moves document inserted");
            }); 
        }
        console.log(result);
    });
}*/

function fishPlay(ws){
    console.log("We are playing Go Fish");
    fishSockets.push(ws);
    let obj = {};
    let index=fishSockets.indexOf(ws);
    if(index%2==0) {
        ///*
        obj.action="Go Fish";
        obj.gameact="Setup";
        obj.status = "Waiting for player to join";
        obj.fish=false;
        obj.askCard=null;
        obj.numberOfOpponentCards = fishPlayers[index+1].getHandCopy().length;
        obj.yourCards = fishPlayers[fishSockets.indexOf(ws)].getHandCopy();
        obj.readyToPlay = false;
        fishSockets[index].send(JSON.stringify(obj));
        //*/
    } else if(fishSockets.indexOf(ws)%2==1){
        obj.action="Go Fish";
        obj.gameact="Setup";
        obj.status = "Your turn";
        obj.fish=true;
        obj.askCard=null;
        obj.numberOfOpponentCards = fishPlayers[index-1].getHandCopy().length;
        obj.yourCards = fishPlayers[index].getHandCopy();
        obj.readyToPlay = true;
        fishSockets[index].send(JSON.stringify(obj));
        //*/
        
        //set up for a new game to be played if more players join
                let deck = new Deck();
                deck.shuffle();
                deck.shuffle();
                //eightPiles.push(pile);
                fishDecks.push(deck);
                let p1=new Player(deck);
                let p2=new Player(deck);
        
            //for(var i=0; i<12; i++){p1.add(deck.dealACard());p2.add(deck.dealACard());}
            fishComplete.push(false);
            fishPlayers.push(p1);
            fishPlayers.push(p2);
    }
}
///*
function goFish(message, playerNumber){//Go Fish player has said go fish
    let empty=false;
    let score=false;
    let otherplayerNumber = 0;
    
    if(playerNumber%2 == 0){
        gamenum=(playerNumber)/2;
        otherplayerNumber=(playerNumber+1);
    }else{
        gamenum=(playerNumber-1)/2;
        otherplayerNumber=(playerNumber-1);
    }
    console.log("This many cards left in the deck"+fishDecks[gamenum].list.length);
    
    let c=null;
    let obj={};
    if(fishDecks[gamenum].list.length==0){//No cards left to draw from the pile
        //Send info to players
        obj.status="No cards to draw from the deck";
        obj.action="Go Fish";
        obj.gameact="Empty";
        //obj.drawCard=newCard;
        obj.yourCards=fishPlayers[otherplayerNumber].getHandCopy();
        obj.numberOfOpponentCards=fishPlayers[playerNumber].getHandCopy().length;
        obj.fish=false;
        obj.askCard=null;
        obj.readyToPlay=false;
        fishSockets[otherplayerNumber].send(JSON.stringify(obj));
        
        obj.status="Deck is out of cards. Choose a card to ask for";
        obj.action="Go Fish";
        obj.gameact="Empty";
        //obj.drawCard=newCard;
        obj.yourCards=fishPlayers[playerNumber].getHandCopy();
        obj.numberOfOpponentCards=fishPlayers[otherplayerNumber].getHandCopy().length;
        obj.askCard=null;
        obj.fish=true;
        obj.readyToPlay=true;
        fishSockets[playerNumber].send(JSON.stringify(obj));
    }else{
        let newCard=fishDecks[gamenum].dealACard();
        
            fishPlayers[otherplayerNumber].add(newCard);//Add card to other player's hand
            
            //Send info to players
            obj.status="Recieving a card from the deck";
            obj.action="Go Fish";
            obj.gameact="Go Fish draw";
            obj.drawCard=newCard;
            obj.yourCards=fishPlayers[otherplayerNumber].getHandCopy();
            obj.numberOfOpponentCards=fishPlayers[playerNumber].getHandCopy().length;
            obj.fish=false;
            obj.askCard=null;
            obj.readyToPlay=false;
            fishSockets[otherplayerNumber].send(JSON.stringify(obj));
        
            obj.status="Processing move";
            obj.action="Go Fish";
            obj.gameact="Go Fish deal";
            obj.drawCard=newCard;
            obj.yourCards=fishPlayers[playerNumber].getHandCopy();
            obj.numberOfOpponentCards=fishPlayers[otherplayerNumber].getHandCopy().length;
            obj.askCard=null;
            obj.fish=true;
            obj.readyToPlay=false;
            fishSockets[playerNumber].send(JSON.stringify(obj));
            
            /*
                Check for this player scoring a poing
            */
            setTimeout(()=>{
            c=checkAmount(fishPlayers[playerNumber-1]);
            if(c!=null){
                score=true;
                fourOfs[playerNumber-1]++;
                console.log((playerNumber)+" Player num four ofs "+fourOfs[playerNumber-1]);
                //check if the game is over
                if((fishDeck.list.length==0) && (fishPlayers[playerNumber].list.length==0) && (fishPlayers[otherplayerNumber].list.length==0)){
                    //Check for a winner
                    fishWinner(message, playerNumber);
                }
                else{
                    let phand=fishPlayers[otherplayerNumber].getHandCopy();
                    //check if other player's hand is empty
                    if(phand.length==0){//if so that player draws cards from the deck
                        console.log("Other player's hand is empty gofish");
                        //var row=0;
                        phand=new Array();
                        for(var i=0; i<5; i++){
                            if(fishDeck.list.length==0){
                                break;
                            }
                            console.log("adding to phand gofish");
                            phand.push(fishDeck.dealACard());
                            //row++;
                        }
                        console.log("This many cards left in the deck"+fishDeck.list.length);
                        fishPlayers[otherplayerNumber].setHand(phand);
                    }
                    
                    //Send info to players
                    //other player
                    obj.action="Go Fish";
                    obj.gameact="Player Score";
                    obj.status="You have scored a point";
                    //obj.drawCard=newCard;
                    obj.yourCards=fishPlayers[otherplayerNumber].getHandCopy();
                    obj.numberOfOpponentCards=fishPlayers[playerNumber].getHandCopy().length;
                    obj.fish=false;
                    obj.score=c;
                    obj.askCard=null;
                    obj.readyToPlay=false;
                    fishSockets[otherplayerNumber].send(JSON.stringify(obj));

                    //this player
                    obj.action="Go Fish";
                    obj.gameact="Opponent Score";
                    obj.status="Opponent has scored a point Choose a card to ask for";
                    obj.yourCards=fishPlayers[playerNumber].getHandCopy();
                    obj.numberOfOpponentCards=fishPlayers[otherplayerNumber].getHandCopy().length;
                    obj.askCard=null;
                    obj.score=c;// this is already true
                    obj.fish=true;
                    obj.readyToPlay=true;
                    fishSockets[playerNumber].send(JSON.stringify(obj));
                }
            }
            else{//Send info to players
                
                obj.status="You drew a "+newCard.toString();
                obj.action="Go Fish";
                obj.gameact="Update";
                //obj.drawCard=newCard;
                obj.yourCards=fishPlayers[otherplayerNumber].getHandCopy();
                obj.numberOfOpponentCards=fishPlayers[playerNumber].getHandCopy().length;
                obj.fish=false;

                obj.askCard=null;
                obj.readyToPlay=false;
                fishSockets[otherplayerNumber].send(JSON.stringify(obj));

                obj.status="Choose a card to ask for";
                obj.action="Go Fish";
                obj.gameact="Update";
                //obj.drawCard=newCard;
                obj.yourCards=fishPlayers[playerNumber].getHandCopy();
                obj.numberOfOpponentCards=fishPlayers[otherplayerNumber].getHandCopy().length;
                obj.askCard=null;

                obj.fish=true;
                obj.readyToPlay=true;
                fishSockets[playerNumber].send(JSON.stringify(obj));
            }
            },3500);
    }
}//End go fish function

/*
*For giving cards in one player's hand to the other
*in Go Fish
*/
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
    let otherplayerNumber = 0;
    
    if(playerNumber%2 == 0){
        gamenum=(playerNumber)/2;
        otherplayerNumber=(playerNumber+1);
    }else{
        gamenum=(playerNumber-1)/2;
        otherplayerNumber=(playerNumber-1);
    }
    let obj={};
    let c=null;
    if(newHand.length==0){
        console.log("A player's hand is empty");
        //console.log("This many cards left in the deck"+fishDeck.list.length);
        var row=0;
        newHand=new Array();
        while(row<5){
            if(fishDeck.list.length==0){
                break;
            }
            //console.log("adding to newHand");
            newHand.push(fishDeck.dealACard());
            row++;
        }
        console.log("This many cards left in the deck"+fishDeck.list.length);
        fishPlayers[playerNumber].setHand(newHand);
    }
    
        for(var i=0; i<tempcards.length; i++){
            fishPlayers[playerNumber-1].add(tempcards[i]);
        }
        
        obj.action="Go Fish";
        obj.gameact="Receive cards";
        obj.status="Recieving cards";
        obj.newCards=tempcards;
        obj.yourCards=fishPlayers[otherplayerNumber].getHandCopy();
        obj.numberOfOpponentCards=fishPlayers[playerNumber].getHandCopy().length;
        obj.fish=false;
        obj.askCard=null;
        obj.readyToPlay=false;
        fishSockets[otherplayerNumber].send(JSON.stringify(obj));
        
        obj.newCards=null;
        obj.action="Go Fish";
        obj.gameact="Give cards";
        obj.numCards=tempcards.length;
        obj.status="Sending cards to other player.";
        obj.yourCards=fishPlayers[playerNumber].getHandCopy();
        obj.numberOfOpponentCards=fishPlayers[otherplayerNumber].getHandCopy().length;
        obj.askCard=null;
        obj.fish=true;
        obj.readyToPlay=false;
        fishSockets[playerNumber].send(JSON.stringify(obj));
        
        setTimeout(()=>{
        c=checkAmount(fishPlayers[playerNumber-1]);    
        if(c!=null){
            score=true;
            fourOfs[otherplayerNumber]++;
            console.log((otherplayerNumber) +" Player has this many four ofs " +fourOfs[otherplayerNumber]);
            
            let phand=fishPlayers[otherplayerNumber].getHandCopy();
            if(phand.length==0){
                console.log("Other player's hand is empty");
                //console.log("This many cards left in the deck"+fishDeck.list.length);
                var row=0;
                phand=new Array();
                while(row<5){
                    if(fishDeck.list.length==0){
                        break;
                    }
                    phand.push(fishDeck.dealACard());
                    row++;
                }
                fishPlayers[otherplayerNumber].setHand(phand);
            
        }
            if((fishDecks[gamenum].list.length==0) && (fishPlayers[playerNumber].list.length==0) && (fishPlayers[otherplayerNumber].list.length==0)){
                fishWinner(message, playerNumber);    
            }
            else{
                obj.action="Go Fish";
                obj.gameact="Player Score";
                obj.status="You have scored a point";
                obj.yourCards=fishPlayers[otherplayerNumber].getHandCopy();
                obj.numberOfOpponentCards=fishPlayers[playerNumber].getHandCopy().length;
                obj.fish=false;
                obj.score=c;
                obj.askCard=null;
                obj.readyToPlay=false;
                fishSockets[otherplayerNumber].send(JSON.stringify(obj));

                obj.action="Go Fish";
                obj.gameact="Opponent Score";
                obj.status="Opponent Scores. Choose a card to ask for";
                obj.yourCards=fishPlayers[playerNumber].getHandCopy();
                obj.numberOfOpponentCards=fishPlayers[otherplayerNumber].getHandCopy().length;
                obj.askCard=null;
                obj.comScore=c;
                obj.fish=true;
                obj.readyToPlay=true;
                fishSockets[playerNumber].send(JSON.stringify(obj));
            }
        }
        else{//No point was scored
            obj.action="Go Fish";
            obj.gameact="Update";
            obj.status="Cards have been succesfully transfered to you";
            obj.yourCards=fishPlayers[otherplayerNumber].getHandCopy();
            obj.numberOfOpponentCards=fishPlayers[playerNumber].getHandCopy().length;
            obj.fish=false;
            obj.askCard=null;
            obj.readyToPlay=false;
            fishSockets[otherplayerNumber].send(JSON.stringify(obj));
            
            obj.action="Go Fish";
            obj.gameact="Update";
            obj.status="Cards sent. Choose a card to ask for";
            obj.yourCards=fishPlayers[playerNumber].getHandCopy();
            obj.numberOfOpponentCards=fishPlayers[otherplayerNumber].getHandCopy().length;
            obj.askCard=null;
            obj.fish=true;
            obj.readyToPlay=true;
            fishSockets[playerNumber].send(JSON.stringify(obj));
        }
        },3500);
    
}

function askForCard(message, playerNumber){
    console.log("Asking the opponent for a card");
    let askCard=message.askCard;
    let tempCard = new Card(askCard.suit, askCard.value);
    let hand = message.hand;
    let newHand = JSON.parse(JSON.stringify( hand ),
            (k,v)=>(typeof v.suit)!=="undefined" ? new Card(v.suit, v.value) : v);
    
    fishPlayers[playerNumber].setHand(hand);
    let otherplayerNumber = 0;
    
    if(playerNumber%2 == 0){
        gamenum=(playerNumber)/2;
        otherplayerNumber=(playerNumber+1);
    }else{
        gamenum=(playerNumber-1)/2;
        otherplayerNumber=(playerNumber-1);
    }
    
    let obj={};
    
    obj.action="Go Fish";
    obj.gameact="Ask for cards";
    obj.status="Do you have any "+ tempCard.getValue()+"'s";
    obj.yourCards=fishPlayers[otherplayerNumber].getHandCopy();
    obj.numberOfOpponentCards=fishPlayers[playerNumber].getHandCopy().length;
    obj.fish=false;
    obj.askCard=tempCard;
    obj.readyToPlay=true;
    fishSockets[otherplayerNumber].send(JSON.stringify(obj));

    obj.action="Go Fish";
    obj.status="Seeing if other player has your card";
    obj.yourCards=fishPlayers[playerNumber].getHandCopy();
    obj.numberOfOpponentCards=fishPlayers[otherplayerNumber].getHandCopy().length;
    obj.askCard=null;
    obj.fish=false;
    obj.readyToPlay=false;
    fishSockets[playerNumber].send(JSON.stringify(obj)); 
}

function fishWinner(message, playerNumber){
    console.log("Calculating the winner");
    let obj={};
    let otherplayerNumber = 0;
    
    if(playerNumber%2 == 0){
        gamenum=(playerNumber)/2;
        otherplayerNumber=(playerNumber+1);
    }else{
        gamenum=(playerNumber-1)/2;
        otherplayerNumber=(playerNumber-1);
    }
    
    if(fourOfs[otherplayerNumber]>fourOfs[playerNumber]){
        obj.action="Go Fish";
        obj.status="You win!";
        obj.yourCards=fishPlayers[otherplayerNumber].getHandCopy();
        obj.numberOfOpponentCards=fishPlayers[playerNumber].getHandCopy().length;
        obj.fish=false;
        obj.askCard=null;
        obj.readyToPlay=false;
        fishSockets[otherplayerNumber].send(JSON.stringify(obj));
    
        obj.action="Go Fish";
        obj.status="Sorry You lose!";
        obj.yourCards=fishPlayers[playerNumber].getHandCopy();
        obj.numberOfOpponentCards=fishPlayers[otherplayerNumber].getHandCopy().length;
        obj.askCard=null;
        obj.fish=true;
        obj.readyToPlay=false;
        fishSockets[playerNumber].send(JSON.stringify(obj));
    }
    else if(fourOfs[otherplayerNumber]<fourOfs[playerNumber]){
        obj.action="Go Fish";
        obj.status="Sorry You Lose!";
        obj.yourCards=fishPlayers[otherplayerNumber].getHandCopy();
        obj.numberOfOpponentCards=fishPlayers[playerNumber].getHandCopy().length;
        obj.fish=false;
        obj.askCard=null;
        obj.readyToPlay=false;
        fishSockets[otherplayerNumber].send(JSON.stringify(obj));
    
        obj.action="Go Fish";
        obj.status="You win!";
        obj.yourCards=fishPlayers[playerNumber].getHandCopy();
        obj.numberOfOpponentCards=fishPlayers[otherplayerNumber].getHandCopy().length;
        obj.askCard=null;
        obj.fish=true;
        obj.readyToPlay=false;
        fishSockets[playerNumber].send(JSON.stringify(obj));
    }
    else{//tie
        obj.action="Go Fish";
        obj.status="It's a tie!";
        obj.yourCards=fishPlayers[otherplayerNumber].getHandCopy();
        obj.numberOfOpponentCards=fishPlayers[playerNumber].getHandCopy().length;
        obj.fish=false;
        obj.askCard=null;
        obj.readyToPlay=false;
        fishSockets[otherplayerNumber].send(JSON.stringify(obj));
    
        obj.action="Go Fish";
        obj.status="It's a tie!";
        obj.yourCards=fishPlayers[playerNumber].getHandCopy();
        obj.numberOfOpponentCards=fishPlayers[otherplayerNumber].getHandCopy().length;
        obj.askCard=null;
        obj.fish=true;
        obj.readyToPlay=false;
        fishSockets[playerNumber].send(JSON.stringify(obj));
    }
        
    fishComplete[gamenum]=true;
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
                let Hands = JSON.parse(JSON.stringify(hand),
                        (k,v)=>(typeof v.suit)!=="undefined" ? new Card(v.suit, v.value) : v);
                for(var j=0; j<Hands.length; j++){
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
    ///////////////////////////////
    if(playernumber%2 == 0){
        gamenum=(playernumber)/2;
    }
    else{
        gamenum=(playernumber-1)/2;
        odd=true;
    }
    if(playernumber%2==0) {//Handles a player leaving the game
        let obj = {};
        if(fishSockets[playernumber+1]!=null  && !fishComplete[gamenum]){
            obj.action="Go Fish";
            obj.gameact="Quit";
            obj.status = "You win!! Opponent has left the game!";
            obj.numberOfOpponentCards = fishPlayers[playernumber+1].getHandCopy().length;
            obj.askCard=null;
            obj.yourCards = fishPlayers[playernumber].getHandCopy();
            obj.readyToPlay = false;
        
            fishSockets[playernumber+1].send(JSON.stringify(obj));
        }
        
        fishSockets[playernumber]=null;

    } else if(playernumber%2==1){
        let obj = {};
        if(fishSockets[playernumber-1]!=null && !fishComplete[gamenum]){
            obj.action="Go Fish";
            obj.gameact="Quit";
            obj.status = "You win!! Opponent has left the game!";
            obj.numberOfOpponentCards = fishPlayers[playernumber-1].getHandCopy().length;
            obj.askCard=null;
            obj.yourCards = fishPlayers[playernumber].getHandCopy();
            obj.readyToPlay = false;

            fishSockets[playernumber-1].send(JSON.stringify(obj));
        }
        fishSockets[playernumber]=null;
    }
    fishComplete[gamenum]=true;
    cleanUp();
}