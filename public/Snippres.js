/**
 * Setting up Crazy Eights human vs computer
 */
class Snippres {
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
	    this.snipview = new Snipview(this);
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
    
    comTurn(){
        if(!this.human.played){
            this.snip=false;
            this.snap=false;
        }
        this.human.played=false;
        //alert("Passing play to the computer");
        while(true){
            if(!this.snip && !this.snap){
                //alert("snip");
                let pcard=this.pile.getTopCard();
                let hand=this.cpu.getHandCopy();
                //alert("hand at 0 = "+hand[0]);
                this.pile.acceptACard(hand[0]);
                this.cpu.remove(this.cpu.indexOf(hand[0]));
                this.snipview.displayComputerHand(this.cpu.getHandCopy());
                this.snipview.displayPileTopCard(this.pile.getTopCard());
                this.snip=true;
                this.snipview.displayMessage("Snip");
                this.cpu.played=true;
                
                //alert("cpu hand = "+this.cpu.getHandCopy());
                if(this.cpu.isHandEmpty()){
                    this.snipview.displayMessage("CPU wins!! Rematch?");
                    document.getElementById("passturn").disabled=true;
                    return;
                }
                
            }
            else if(this.snip && !this.snap){
                //alert("snap");
                let pcard=this.pile.getTopCard();
                let hand=this.cpu.getHandCopy();
                let com=null;
                let play=false;
                for(var i=0; i<hand.length; i++){
                    if(hand[i].getValue() == this.pile.getTopCard().getValue()){
                        //alert("Snap play");
                        this.cpu.played=true;
                        //alert("pcard: "+pcard);
                        //alert("hand card: "+hand[i]);
                        com=hand[i];
                        play=true;
                        this.pile.acceptACard(hand[i]);
                        this.cpu.remove(this.cpu.indexOf(hand[i]));
                        this.snipview.displayComputerHand(this.cpu.getHandCopy());
                        this.snipview.displayPileTopCard(this.pile.getTopCard());
                        this.snap=true;
                        this.snipview.displayMessage("Snap");
                        if(this.cpu.isHandEmpty()){
                            this.snipview.displayMessage("CPU wins!! Rematch?");
                            document.getElementById("passturn").disabled=true;
                            return;
                        }
                        break;
                    }
                }
                
                if(!this.cpu.played){
                    this.snip=false;
                    this.snap=false;
                    this.snipview.displayMessage("No Play made the round has been reset");
                    break;
                }
                if(!play){
                    this.cpu.played=false;
                    break;
                }
            }
            else if(this.snip && this.snap){
                let pcard=this.pile.getTopCard();
                let hand=this.cpu.getHandCopy();
                let com=null;
                let play=false;
                for(var i=0; i<hand.length; i++){
                    if(hand[i].getValue() == this.pile.getTopCard().getValue()){
                        //alert("Snorum play");
                        this.cpu.played=true;
                        com=hand[i];
                        //alert("pcard: "+pcard);
                        //alert("hand card: "+hand[i]);
                        play=true;
                        this.pile.acceptACard(hand[i]);
                        this.cpu.remove(this.cpu.indexOf(hand[i]));
                        this.snipview.displayComputerHand(this.cpu.getHandCopy());
                        this.snipview.displayPileTopCard(this.pile.getTopCard());
                        this.snip=false;
                        this.snap=false;
                        //alert("pcard after: "+this.pile.getTopCard());
                        this.snipview.displayMessage("Snorum");
                        this.cpu.played=true;
                        if(this.cpu.isHandEmpty()){
                            this.snipview.displayMessage("CPU wins!! Rematch?");
                            document.getElementById("passturn").disabled=true;
                            return;
                        }
                        break;
                    }
                }
                
                if(!this.cpu.played){
                    this.snip=false;
                    this.snap=false;
                    this.snipview.displayMessage("No play made the round has been reset");
                    break;
                }
                
                if(!play){
                    this.cpu.played=false;
                    break;
                }
            }
            
        }
        
    }

//Sets up the start of the game
 play(){//Set up for playing Snip snap snorum
     this.snipview.displayMessage("Welcome to Snip Snap Snorum");
     this.human.addCards();
     this.cpu.addCards();
     this.snipview.displayPileTopCard(null);
     this.snipview.displayComputerHand(this.cpu.getHandCopy());
     this.snipview.displayHumanHand(this.human.getHandCopy());
     return;
 }
    
    resetGame(){//Resets the game with a new deck and players
        this.snipview.eraseHands();
        this.deck=new Deck();
        this.moves=0;
        this.snap=false;
        this.snip=false;
        this.snipview.displayMessage("Welcome to Snip Snap Snorum");
        document.getElementById("passturn").disabled=false;
        
	    this.deck.shuffle();
        this.deck.shuffle();
        this.date=null;
        this.started=false;
	    this.pile = new Pile();
	    
        this.human = new Sniphuman(this.deck, this.pile, this.view);
	    this.cpu = new Snipcpu(this.deck, this.pile, this.view);
        this.human.addCards();
        this.cpu.addCards();
        this.snipview.displayPileTopCard(this.pile.getTopCard());
        this.snipview.displayComputerHand(this.cpu.getHandCopy());
        this.snipview.displayHumanHand(this.human.getHandCopy());
        
        return;
    }
    
    goOnline(){
        //set up Snip Snap Snorum for online play
        this.snipview.removeEvents();
        this.snipview.eraseHands();
    }

}