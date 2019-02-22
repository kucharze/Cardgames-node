/**
 * Setting up Crazy Eights human vs computer
 */
class SnippresO {
    /**
     * Initialize game by creating and shuffling the deck,
     * dealing one card (other than an 8) to the discard pile,
     * and dealing 7 cards to each player.
     */
    constructor() {
        this.moves=0;
	    this.deck = new Deck();
	    this.deck.shuffle();
        this.deck.shuffle();
        this.snip=false;
        this.snap=false;
        this.date=null;
        this.started=false;
        
	    this.pile = new Pile();
	    //this.pile.acceptACard(this.deck.dealACard());
	    this.snipview = new SnipviewO(this);
	    this.human=new Sniphuman(this.deck, this.pile, this.view);
	    this.cpu=new Snipcpu(this.deck, this.pile, this.view);
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
             this.snipview.displayMessage("Cannot play that card");
         }
     }
     if(this.human.isHandEmpty()){
         this.snipview.displayMessage("Congradulations! You win!!!");
         document.getElementById("passturn").disabled=true;
     }
     
    return;
 }
    
    update(message){
        //alert("Update");
	   var playerhand=[];
        let state=message.state;
        if(state=="snip"){
            this.snip=true;
            this.snap=false;
        }
        else if(state=="snap"){
            this.snip=true;
            this.snap=true;
        }
        else{
            this.snip=false;
            this.snap=false;
        }
      //alert("Message status is"+message.status);
	   let hand = message.yourCards;
	   let newHand = JSON.parse( JSON.stringify( hand ),
                            (k,v)=>(typeof v.suit)!=="undefined" ? new Card(v.suit, v.value) : v);
///*
	if(message.pileTopCard!=undefined){
	let pilecard=message.pileTopCard;
    	let topcard=JSON.parse( JSON.stringify( pilecard ), 
	(k,v)=>(typeof v.suit)!=="undefined" ? new Card(v.suit, v.value) : v);
        
    	this.view.displayPileTopCard(topcard);
    	this.pile.acceptACard(topcard);
	}
//*/
	this.human.setHand(newHand);
	this.view.displayStatus(message.status);
	this.view.displayComputerHand(message.numberOfOpponentCards);
	this.view.displayHumanHand(newHand);

	if (message.readyToPlay) {this.view.unblockPlay();}
	else {this.view.blockPlay();}
  }
    
    goOffline(){
        
    }

}