/**
 * Setting up Crazy Eights human vs computer
 */
class Presenter8O {
  
    /**
     * Initialize game by creating and shuffling the deck,
     * dealing one card (other than an 8) to the discard pile,
     * and dealing 7 cards to each player.
     */
    constructor(socket) {
	this.deck = new Deck();
	this.deck.shuffle();
	while(this.deck.isTopCardAnEight()){
	  this.deck.shuffle();
	}
	//this.self=this;
	this.pile = new Pile();
	this.pile.acceptACard(this.deck.dealACard());
	this.view = new View8O(this);
	this.human = new HumanPlayer8O(this.deck, this.pile, this.view);
	this.ws = socket;
	//this.ws.onmessage= function(event) {
//		self.update(event);};
    }

 cardPicked(){
   this.view.displayStatus("Waiting for card to be dealt");
   var mess = {"action":"Crazy Eights", "gameact":"cardPicked" };
   this.ws.send(JSON.stringify(mess));
   this.view.blockPlay();
   //this.completeMyTurn();
 }

//takes the string for a card and determines if the player's turn is over
//if it is complete the cycle of the players turn and the humans turn
 cardSelected(cardString){
   if(this.human.cardSelected(cardString)){
	this.completeMyTurn();
     }
    return;
 }

 completeMyTurn(){
    let cardPlayed=this.pile.getTopCard();
    let suit=this.pile.getAnnouncedSuit();
     let data={"action":"Crazy Eights","gameact":"cardSelected", "card":cardPlayed, "announcedSuit": suit};
    ws.send(JSON.stringify(data));
     
    this.view.displayStatus("Waiting for Opponent to play");
     this.view.blockPlay();
     return;
 }

//Callback after suit picked passed through to human object for processing.
 suitPicked(suit){
   this.human.suitPicked(suit)
   this.completeMyTurn();
 }

  update(message){
    //alert("Update");
	var playerhand=[];
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
      
      if(message.procedure=="cardPicked"){
          //alert("in card picked sextion");
          if(message.drawCard){
              //alert("in card picked sextion");
              let card=message.pileTopCard;
    	       let ccard=JSON.parse( JSON.stringify(card), 
	           (k,v)=>(typeof v.suit)!=="undefined" ? new Card(v.suit, v.value) : v);
              this.view.addHumanCard(ccard,this.human.getHandCopy().length);
              this.view.displayComputerHand(message.numberOfOpponentCards);
          }else{
              this.view.addComCard(message.numberOfOpponentCards);
              this.view.displayHumanHand(newHand);
          }
      }
      else if((message.procedure==null) || (message.procedure=="") ) {
          this.view.displayComputerHand(message.numberOfOpponentCards);
	       this.view.displayHumanHand(newHand);
      }
      
	if(message.pileAnnouncedSuit) {
          this.pile.setAnnouncedSuit(message.pileAnnouncedSuit);
        }

	if (message.readyToPlay) {this.view.unblockPlay();}
	else {this.view.blockPlay();}
  }
    
    goOffline(){
        //remove event listeners and unblock play in order to reset game for offline play
        this.view.unblockPlay();
        this.view.removeEvent();
        this.view.eraseHands();
    }

}