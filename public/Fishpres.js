/**
 * Setting up Crazy Eights human vs computer
 */
class Fishpres {
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
	    
        this.pile = new Pile();
	    //this.pile.acceptACard(this.deck.dealACard());
	    this.fview = new Fishview(this);
        
        this.askCard=null;
        this.canDraw=true;
        
        this.humNumFours=0;
        this.comNumFours=0;
        
	    this.human = new HumanPlayer(this.deck, this.pile, this.fview);
	    this.computer = new ComputerPlayer(this.deck, this.pile, this.fview);
    }

 cardPicked(){
   this.human.cardPicked();
    this.computer.cardPicked();
   this.completeBothTurns();
 }
    
    comTurn(){
        let card=this.computer.fish();
        this.fview.displayMessage("Do you have any "+card.getValue()+"'s")
        this.askCard=card;
    }
    
    sayNo(){
        if(this.human.findValue(this.askCard.getValue())!=null ){
            this.fview.displayMessage("You have a "+this.askCard.getValue()+ " that you can give");
            return;
        }
        else{
            this.computer.cardPicked();
            this.computer.checkAmount();
        }
        this.human.fish=true;
        this.fview.displayMessage("Pick a card to ask for");
    }
    
    fish(cardstring){
        //this.human.checkAmount();
        
        let card=this.human.find(cardstring);
        
        if(card !=null){//testing out card count function
            //let total=this.human.countCard(card);
            //alert("total= "+total);
            //return;
        }
        else{
            //return;
        }
        //this.human.countCard(card);
        
        if(!this.human.fish){
            alert("Recieving");
            
            if(this.human.give(cardstring, this.askCard)){
                this.computer.add(card);
                //let index=this.computer.indexOf(this.askCard);
                //alert("Index = "+index);
                //this.computer.remove(this.computer.indexOf(this.askCard));
                
                if(this.computer.checkAmount()){
                    this.comNumFours++;
                }
                
                if(this.human.isHandEmpty()){
                    this.drawCards(true);
                }
                if(this.computer.isHandEmpty()){
                    this.drawCards(false);
                }
                this.fview.displayComputerHand(this.computer.getHandCopy());
                
                
                this.fview.displayMessage("Pick a card to ask for");
                this.human.fish=true;
            }
            return;
        }
        else{
            alert("Fishing");
            if(card==null){
                return;
            }
            if(!this.computer.give(card)){
                this.human.cardPicked();
            }
            else{
                this.human.list.push(this.computer.fishCard);
                this.computer.nullifyCard();
            }
            
            
            this.human.checkAmount();//check hand for four of a kinds' to remove
            
            if(this.human.isHandEmpty()){
                this.drawCards(true);
            }
            if(this.computer.isHandEmpty()){
                this.drawCards(false);
            }
            
            
            this.fview.displayHumanHand(this.human.getHandCopy());
            this.fview.displayComputerHand(this.computer.getHandCopy());
            
            this.human.fish=false;
            this.comTurn();
        }
        
    }
    
    //Player draws cards because they have none in hand
    drawCards(playerval){
        if(!this.deck.isEmpty()){
            if(playerval==true){
                for(var i=0; i<5; i++){
                    this.human.add(this.deck.dealACard());
                }
            }
            else{
                for(var i=0; i<5; i++){
                    this.computer.add(this.deck.dealACard());
                }
            }
            
        }
        else{
            if(this.humNumFours>this.comNumFours){
                this.fview.displayMessage("You win!!");
            }
            else{
                this.fview.displayMessage("Sorry. You have lost.")
            }
        }
    }

//Sets up the start of the game
 play(){
   this.fview.displayComputerHand(this.computer.getHandCopy());
   this.fview.displayHumanHand(this.human.getHandCopy());
   return;
 }
    
    resetGame(){
        //alert("attempting to reset");
        this.fview.eraseHands();
        this.deck=new Deck();
        this.moves=0;
        this.fview.displayMessage("Welcome to Go Fish");
	    this.deck.shuffle();
	    this.deck.shuffle();
        
        //document.getElementById("No").disabled=false;
	    
	    this.pile = new Pile();
	    //this.pile.acceptACard(this.deck.dealACard());
	    this.human = new HumanPlayer(this.deck, this.pile, this.fview);
	    this.computer = new ComputerPlayer(this.deck, this.pile, this.fview);
        
        //this.fview.displayPileTopCard(this.pile.getTopCard());
        this.fview.displayComputerHand(this.computer.getHandCopy());
        this.fview.displayHumanHand(this.human.getHandCopy());
        return;
    }


}