/**
 * Setting up Crazy Eights human vs computer
 */
class SnippresO {
    /**
     * Initialize game by creating and shuffling the deck,
     * dealing one card (other than an 8) to the discard pile,
     * and dealing 7 cards to each player.
     */
    constructor(socket) {
        this.moves=0;
	    this.deck = new Deck();
	    this.deck.shuffle();
        this.deck.shuffle();
        this.snip=false;
        this.snap=false;
        
        this.ws=socket;
	    this.pile = new Pile();
	    //this.pile.acceptACard(this.deck.dealACard());
	    this.snipview = new SnipviewO(this);
	    this.human=new Sniphuman(this.deck, this.pile, this.view);
    }

//takes the string for a card and determines if the player's turn is over
 cardSelected(cardString){
     let card=this.pile.getTopCard();
     let hum=this.human.find(cardString);
     if(!this.snip){
         this.pile.acceptACard(hum);
         this.snipview.displayMessage("Snip");
         this.snipview.displayPileTopCard(hum);
         this.human.remove(this.human.indexOf(hum));
         this.snipview.displayHumanHand(this.human.getHandCopy());
         this.snip=true;
         this.human.played=true;
     }
     else if(this.snip && !this.snap){
         if(card.getValue() == hum.getValue()){
             this.pile.acceptACard(hum);
             this.human.remove(this.human.indexOf(hum));
             this.snipview.displayMessage("Snap");
             this.snap=true;
             this.snipview.displayHumanHand(this.human.getHandCopy());
             this.snipview.displayPileTopCard(hum);
             this.human.played=true;
         }
         else{
             this.snipview.displayMessage("Cannot play that card "+hum);
             return;
         }
     }
     else if(this.snip && this.snap){
         if(card.getValue() == hum.getValue()){
             this.pile.acceptACard(hum);
             this.human.remove(this.human.indexOf(hum));
             this.snipview.displayMessage("Snorum. You may now start the next round");
             this.snipview.displayHumanHand(this.human.getHandCopy());
             this.snipview.displayPileTopCard(hum);
             this.snip=false;
             this.snap=false;
             this.human.played=true;
         }
         else{
             this.snipview.displayMessage("Cannot play that card "+hum);
             return;
         }
     }
     let obj={};
     obj.action="Snip Snap Snorum";
     if(this.human.isHandEmpty()){
         //this.snipview.displayMessage("Congradulations! You win!!!");
         obj.gameact="victory";
         obj.hand=this.human.getHandCopy();
         obj.snip=this.snip;
         obj.snap=this.snap;
         obj.pileCard=this.pile.getTopCard();
         obj.madePlay=this.human.played;
         this.human.played=false;
         //this.snipview.blockPlay();
         this.ws.send(JSON.stringify(obj));
     }
     else{
         obj.gameact="update";
         obj.hand=this.human.getHandCopy();
         obj.snip=this.snip;
         obj.snap=this.snap;
         obj.pileCard=this.pile.getTopCard();
         obj.madePlay=this.human.played;
         this.ws.send(JSON.stringify(obj));
     }
     
    return;
 }
    
    sendMes(){
        //If this player did not make a play, reset the round
        if(!this.human.played){
            this.snip=false;
            this.snap=false;
        }
        let mess={};
        mess.action="Snip Snap Snorum";
        mess.gameact="pass turn";
        mess.hand=this.human.getHandCopy();
        mess.snip=this.snip;
        mess.snap=this.snap;
        mess.pileCard=this.pile.getTopCard();
        mess.madePlay=this.human.played;
        this.human.played=false;
        //this.snipview.blockPlay();
        this.ws.send(JSON.stringify(mess));
        
        this.human.played=false;
    }
    
    update(message){
        //alert("Updating Snip Snap Snorum");
	   var playerhand=[];
        //alert("Snip is"+message.snip);
        //alert("Snap is "+message.snap);
        let roundstate="";
        
        this.snip=message.snip;
        this.snap=message.snap;
        if(message.gameact=="update"){
            if(!message.snip){
                roundstate="Snorum";
            }
            else if(message.snip && !message.snap){
                roundstate=" Snip";
            }
            else if(message.snip && message.snap){
                roundstate=" Snap";
            }
            this.snipview.displayMessage(roundstate);
        }
        else{
            if(message.status!="Please wait for the other player to play" || "Waiting for other player to join" || "You may start the round" || "You win!! Opponent has forfeit"){//display roundstate only if not waiting for opponent
            if(!message.snip){
                roundstate=" You may start the round";
            }
            else if(message.snip && !message.snap){
                roundstate=" Snip";
            }
            else if(message.snip && message.snap){
                roundstate=" Snap";
            }
            }
            this.snipview.displayMessage(message.status+roundstate);
        }
        
       ///* 
	   let hand = message.yourCards;
	   let newHand = JSON.parse( JSON.stringify( hand ),
                            (k,v)=>(typeof v.suit)!=="undefined" ? new Card(v.suit, v.value) : v);
                            //*/
        ///*
	   if(message.pileTopCard!=undefined || message.pileTopCard!=null){
	       let pilecard=message.pileTopCard;
    	   let topcard=JSON.parse( JSON.stringify( pilecard ), 
	   (k,v)=>(typeof v.suit)!=="undefined" ? new Card(v.suit, v.value) : v);
        
    	this.snipview.displayPileTopCard(topcard);
    	this.pile.acceptACard(topcard);
	   }
        else{
            this.snipview.displayPileTopCard(null);
        }
//*/
	this.human.setHand(newHand);
	this.snipview.displayComputerHand(message.numberOfOpponentCards);
	this.snipview.displayHumanHand(newHand);

	if (message.readyToPlay) {this.snipview.unblockPlay();}
	else {this.snipview.blockPlay();}
  }
    
    goOffline(){
        //reset view to prepare for offline play once again
        this.snipview.eraseHands();
        this.snipview.unblockPlay();
        this.snipview.removeEvents();
    }

}