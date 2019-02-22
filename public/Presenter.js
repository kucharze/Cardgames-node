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
        this.moves=0;
	    this.deck = new Deck();
	    this.deck.shuffle();
	    while(this.deck.isTopCardAnEight()){
            this.deck.shuffle();
	    }
        
        this.date=null;
        this.started=false;
        this.min=0;
        this.secs=0;
	    this.pile = new Pile();
	    this.pile.acceptACard(this.deck.dealACard());
	    this.view = new View(this);
	    this.human=new HumanPlayer(this.deck, this.pile, this.view);
	    this.computer=new ComputerPlayer(this.deck, this.pile, this.view);
    }

 cardPicked(){
     //alert("Picking up card from offline deck");
     if(!this.started){
         this.started=true;
         this.date=new Date();
     }
   this.human.cardPicked();
   this.completeBothTurns();
 }

//takes the string for a card and determines if the player's turn is over
//if it is complete the cycle of the players turn and the humans turn
 cardSelected(cardString){
    if(!this.started){
         this.started=true;
         this.date=new Date();
     }
     if(this.human.cardSelected(cardString)){
         this.completeBothTurns();
     }
    return;
 }

 completeBothTurns(){
     this.moves++;
    if(this.human.isHandEmpty()){
       alert("You won in this many moves:"+this.moves);
        let elapsed=new Date();
        this.secs=elapsed - this.date;
        this.secs/=1000;
        this.secs=Math.round(this.secs);
        alert("This many Seconds: "+this.secs);
        while(this.secs>60){
            alert("Making time conversions");
            this.secs=this.secs-60;
            this.min++;
        }
        alert("You won in this much time "+this.min + " minutes and "+this.secs+" seconds");
	   this.view.announceHumanWinner();
	   return;
    }
    this.computer.takeATurn();
    if(this.computer.isHandEmpty()){
	this.view.announceComputerWinner();
     }
     if(this.deck.isEmpty()){
         this.deck=new Deck();
         while(this.deck.isTopCardAnEight()){
           this.deck.shuffle();
	     }
     }
     return;
 }

//Sets up the start of the game
 play(){//Set up for playing crazy eights
     this.computer.countCards();
     this.view.displayPileTopCard(this.pile.getTopCard());
     this.view.displayComputerHand(this.computer.getHandCopy());
     this.view.displayHumanHand(this.human.getHandCopy());
     this.view.displayMessage("Welcome to Crazy Eights");
     return;
 }
    
    resetGame(){//Resets the game with a new deck and players
        this.view.eraseHands();
        this.deck=new Deck();
        this.moves=0;
        
	    this.deck.shuffle();
	    while(this.deck.isTopCardAnEight()){
            this.deck.shuffle();
 	    }
        this.date=null;
        this.started=false;
	    this.pile = new Pile();
	    this.pile.acceptACard(this.deck.dealACard());
	    this.human = new HumanPlayer(this.deck, this.pile, this.view);
	    this.computer = new ComputerPlayer(this.deck, this.pile, this.view);
        this.view.displayPileTopCard(this.pile.getTopCard());
        this.view.displayComputerHand(this.computer.getHandCopy());
        this.view.displayHumanHand(this.human.getHandCopy());
        this.view.undisplaySuitPicker();
        
        let suit=document.getElementById("status");
        suit.innerHTML="Welcome to Crazy Eights";
        this.computer.countCards();
        return;
    }

//Callback after suit picked passed through to human object for processing.
 suitPicked(suit){
   if(this.human.suitPicked(suit)){
	   this.completeBothTurns();
       this.view.displaySuit(suit);
   }
    return;
 }
    
    goOnline(){
        //remove cards and event listeners to have set up for online play
        this.view.removeEvents();
        this.view.eraseHands();
    }

}