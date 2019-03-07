/**
 * Setting up Crazy Eights human vs computer
 */
class FishpresO {
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
	    
        this.pile = new Pile();//not used for this game
	    this.fview = new FishviewO(this);
        this.askCard=null;
        this.numFourOfs=0;
        this.turnToFish=false;
        
	    this.human = new HumanPlayer8O(this.deck, this.pile, this.fview);
        
        this.ws=socket;
    }

 cardPicked(){
   this.human.cardPicked();
    this.computer.cardPicked();
   this.completeBothTurns();
 }
    
    goFish(){
        if(this.human.findValue(this.askCard.getValue())!=null ){
            this.fview.displayMessage("You have a "+this.askCard.getValue()+ " that you can give");
            return;
        }
        else{
            this.computer.cardPicked();
        }
        this.human.fish=true;
        this.fview.displayMessage("Pick a card to ask for");
    }
    
    fish(cardstring){
        let card=this.human.find(cardstring);
        
        if(!this.human.fish){//For giving a card to the computer
            //alert("Recieving");
            if(this.human.give(cardstring, this.askCard)){
                this.computer.add(card);
                
            if(this.human.findValue(this.askCard.getValue())!=null ){
                //player still has cards that he she can play
                return;
            }
                
                if(this.computer.checkAmount()){
                    this.comNumFours++;
                    //alert("This computer has this many four ofs " + this.comNumFours);
                }
                
                //this.fview.displayComputerHand(this.computer.getHandCopy());
                
                //this.fview.displayMessage("Pick a card to ask for");
                this.human.fish=true;
            }
            return;
        }
        else{
            //alert("Fishing");
            if(card==null){
                return;
            }
            if(!this.computer.give(card)){
                if(!this.deck.isEmpty()){
                    this.human.cardPicked();
                }
            }else{
                for(var i=0; i<this.computer.fishCards.length; i++){
                    this.human.add(this.computer.fishCards[i]);
                }
                // this.human.list.push(this.computer.fishCard);
                this.computer.nullifyCard();
            }
            
            //check hand for four of a kinds' to remove
            if(this.human.checkAmount()){
                this.humNumFours++;
            }
            
            //this.fview.displayHumanHand(this.human.getHandCopy());
            //this.fview.displayComputerHand(this.computer.getHandCopy());
            
            //this.human.fish=false;
            this.comTurn();
        }
    }
    
    update(message){
        alert("Updating Go Fish");
	   var playerhand=[];
        
        this.fview.displayMessage(message.status);
       ///* 
	   let hand = message.yourCards;
	   let newHand = JSON.parse( JSON.stringify( hand ),
                            (k,v)=>(typeof v.suit)!=="undefined" ? new Card(v.suit, v.value) : v);
                            //*/
    
	   this.human.setHand(newHand);
        alert("Number of opponent cards is "+message.numberOfOpponentCards);
        this.fview.displayComputerHand(message.numberOfOpponentCards);
	   this.fview.displayHumanHand(newHand);

	   if (message.readyToPlay) {this.fview.unblockPlay();}
	   else {this.fview.blockPlay();}
    }
    

    goOffline(){
        this.fview.eraseHands();
        this.fview.removeEvents();
    }
}