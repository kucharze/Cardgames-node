/**
 * Setting up Crazy Eights human vs computer
 */
class FishpresO {
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
	    
        this.pile = new Pile();//not used for this game
	    this.fview = new Fishview(this);
        this.askCard=null;
        this.numFourOfs=0;
        
	    this.human = new HumanPlayerO(this.deck, this.pile, this.fview);
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
        if(!this.human.fish){
            alert("Recieving");
            //alert("The ask card is " + this.askCard);
            if(this.human.give(cardstring,this.askCard)){
                let index=this.computer.indexOf(this.askCard);
                alert("Index = "+index);
                this.computer.remove(this.computer.indexOf(this.askCard));
                this.fview.displayComputerHand(this.computer.getHandCopy());
                
                if(this.computer.isHandEmpty()){
                    this.fview.displayMessage("I win! Thanks for being a good loser");
                    document.getElementById("dups").disabled=true;
                    document.getElementById("sayno").disabled=true;
                    return;
                }
                
                this.fview.displayMessage("Pick a card to ask for");
                this.human.fish=true;
            }
            return;
        }
        else{
            alert("Fishing");
            let card=this.human.find(cardstring);
            //alert(card);
            if(card==null){
                return;
            }
            if(!this.computer.give(card)){
                this.human.cardPicked();
            }
            else{
                this.human.remove(this.human.indexOf(card));
            }
            if(this.human.isHandEmpty()){
                
            }
        
            this.fview.displayHumanHand(this.human.getHandCopy());
            this.fview.displayComputerHand(this.computer.getHandCopy());
            
            this.human.fish=false;
            this.comTurn();
        }
        
    }
    
    update(message){
        
    }
    

    goOffline(){
        
    }
}