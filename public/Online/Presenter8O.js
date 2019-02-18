/**
 * Setting up Crazy Eights human vs computer
 */
class Presenter {
  
    /**
     * Initialize game by creating and shuffling the deck,
     * dealing one card (other than an 8) to the discard pile,
     * and dealing 7 cards to each player.
     */
    constructor() {
	this.deck = new Deck();
	this.deck.shuffle();
	while(this.deck.isTopCardAnEight()){
	  this.deck.shuffle();
	}
	this.self=this;
	this.pile = new Pile();
	this.pile.acceptACard(this.deck.dealACard());
	this.view = new View(this);
	this.human = new HumanPlayer(this.deck, this.pile, this.view);
	this.ws= new WebSocket("ws://165.190.169.78:3000");
	this.ws.onmessage= function(event) {
		self.update(event);
	};
    }

 cardPicked(){
   this.view.displayStatus("Waiting for card to be dealt");
   var mess = { "action":"cardPicked" };
   this.ws.send(JSON.stringify(mess));
   this.view.blockPlay();
   this.completeMyTurn();
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
    let cardPlayed=this.pile.getTopCard;
    let suit=this.pile.getAnnouncedSuit();
    let data={"action":"cardSelected" "card":cardPlayed "announcedSuit": suit};
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

  update(event){
	var data=JSON.parse(event.data);
	var playerhand=[];

	let hand = data.yourCards;
	let newHand = JSON.parse( JSON.stringify( hand ),
                            (k,v)=>(typeof v.suit)!=="undefined" ? new Card(v.suit, v.value) : v);

	if(data.pileTopCard!=undefined){
	let pilecard=data.pileTopCard;
    	let topcard=JSON.parse( JSON.stringify( pilecard ), 
	(k,v)=>(typeof v.suit)!=="undefined" ? new Card(v.suit, v.value) : v);
    	this.view.displayPileTopCard(topcard);
    	this.pile.acceptACard(topcard);
	}

	this.human.setHand(newHand);
	this.view.displayStatus(data.status);
	this.view.displayComputerHand(data.numberOfOpponentCards);
	this.view.displayHumanHand(newHand);
	if(data.pileAnnouncedSuit) {
          this.pile.setAnnouncedSuit(data.pileAnnouncedSuit);
        }

	if (data.readyToPlay==true) {this.view.unblockPlay();}
	else {this.view.blockPlay();}
  }

}