/**
 * Setting up Crazy Eights human vs computer
 */
class Fishpres {
    /**
     * Initialize game by creating and shuffling the deck,
     * dealing one card (other than an 8) to the discard pile,
     * and dealing 7 cards to each player.
     */
    constructor(ws) {
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
        this.moves=0;
        this.socket=ws;
        
	    this.human = new HumanPlayer(this.deck, this.pile, this.fview);
	    this.computer = new ComputerPlayer(this.deck, this.pile, this.fview);
    }
    
    comTurn(){
        let card=this.computer.fish();
        this.fview.displayMessage("Do you have any "+card.getValue()+"'s")
        this.askCard=card;
    }
    
    sayNo(){
        if(this.human.fish){
            this.fview.displayMessage("Cannot do that right now");
            return;
        }
        else{
           if(this.human.findValue(this.askCard.getValue())!=null ){
            this.fview.displayMessage("You have a "+this.askCard.getValue()+ " that you can give");
            return;
        }
        else{
            this.moves++;
            if(!this.deck.isEmpty()){
                this.computer.cardPicked();
            }
            let c=this.computer.checkAmount();
                if(c!=null){
                    this.comNumFours++;
                    this.fview.giveComPoint(c);
                    //alert("This computer has this many four ofs " + this.comNumFours);
                }
            this.fview.displayComputerHand(this.computer.getHandCopy());
        }
        this.human.fish=true;
        this.fview.displayMessage("Pick a card to ask for"); 
        }
        
    }
    
    fish(cardstring){
        alert("Deck has this many cards left"+this.deck.list.length);
        let card=this.human.find(cardstring);
        
        if(!this.human.fish){//For giving a card to the computer
            //alert("Recieving");
            if(this.human.give(cardstring, this.askCard)){
                this.computer.add(card);
                
            if(this.human.findValue(this.askCard.getValue())!=null ){
                //player still has cards that he she can play
                return;
            }
                let c=this.computer.checkAmount();
                if(c!=null){
                    this.comNumFours++;
                    this.fview.giveComPoint(c);
                    //alert("This computer has this many four ofs " + this.comNumFours);
                }
                
                if(this.deck.isEmpty()){
                    if(this.human.isHandEmpty() && this.computer.isHandEmpty()){
                        if(this.humNumFours>this.comNumFours){
                            this.fview.displayMessage("You win!!");
                            document.getElementById("No").disabled=true;
                       
                            let obj={};
                            obj.action="Go Fish";
                            obj.gameact="record";
                            obj.moves=this.moves;
                            this.socket.send(JSON.stringify(obj));
                        }
                    else{
                        this.fview.displayMessage("Sorry. You have lost.");
                        document.getElementById("No").disabled=true;
                    } 
                }
                }else{//For asking the computer for a card
                    if(this.human.isHandEmpty()){
                        this.drawCards(true);
                    }
                    if(this.computer.isHandEmpty()){
                        this.drawCards(false);
                    } 
                }
                    
                if(this.computer.isHandEmpty()){
                    this.fview.displayComputerCard(null);
                }else{
                    this.fview.displayComputerHand(this.computer.getHandCopy());
                }
                
                this.fview.displayMessage("Pick a card to ask for");
                this.human.fish=true;
            }
            return;
        }
        else{//asking the computer for a card
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
                this.computer.nullifyCard();
            }
            
            //check hand for four of a kinds' to remove
            let c=this.human.checkAmount();
            if(c!=null){
                this.humNumFours++;
                this.fview.giveHumanPoint(c);
                alert("User has this many four ofs "+this.humNumFours);
            }
            
            if(this.deck.isEmpty()){
                if(this.human.isHandEmpty() && this.computer.isHandEmpty()){
                   if(this.humNumFours>this.comNumFours){
                       this.fview.displayMessage("You win!!");
                       document.getElementById("No").disabled=true;
                       
                       let obj={};
                       obj.action="Go Fish";
                       obj.gameact="record";
                       obj.moves=this.moves;
                       this.socket.send(JSON.stringify(obj));
                       return;
                    }
                    else{
                        this.fview.displayMessage("Sorry. You have lost.");
                        document.getElementById("No").disabled=true;
                    } 
                }
            }
            else{
               if(this.human.isHandEmpty()){
                   this.drawCards(true);
               }
                if(this.computer.isHandEmpty()){
                    this.drawCards(false);
                } 
            }
            if(this.human.isHandEmpty() && this.computer.isHandEmpty()){
                this.fview.displayHumanHand(null);
                this.fview.displayComputerHand(null);
            }
            else{
                this.fview.displayHumanHand(this.human.getHandCopy());
                this.fview.displayComputerHand(this.computer.getHandCopy());
            }
            
            this.human.fish=false;
            this.comTurn();
        }
        
    }
    
    //Player draws cards because they have none in hand
    drawCards(playerval){
        var i=0;
            if(playerval==true){
                for(var i=0; i<5; i++){
                    if(this.deck.isEmpty()){
                        
                    }
                }
                while(!(this.deck.length==0) || i<5){
                    alert("adding cards to player's hand from deck "+i);
                    this.human.add(this.deck.dealACard());
                    i++;
                }
            }
            else{
                for(var i=0; i<5; i++){
                    
                }
                while(!(this.deck.length==0) || i<5){
                    alert("adding cards to player's hand from deck "+i);
                    this.computer.add(this.deck.dealACard());
                    i++;
                }
            }
    }

//Sets up the start of the game
 play(){
     //below is for purposes of testing and demoing
     for(var i=0; i<15; i++){
         this.human.list.push(this.deck.dealACard());
     }
     for(var i=0; i<15; i++){
         this.computer.list.push(this.deck.dealACard());
     }
     this.fview.displayComputerHand(this.computer.getHandCopy());
     this.fview.displayHumanHand(this.human.getHandCopy());
     return;
 }
    
    resetGame(){
        //alert("attempting to reset");
        this.fview.eraseHands();
        this.deck=new Deck();
        this.moves=0;
        this.fview.displayMessage("Go Fish");
	    this.deck.shuffle();
	    this.deck.shuffle();
        this.moves=0;
        
        document.getElementById("No").disabled=false;
	    
	    this.pile = new Pile();
	    //this.pile.acceptACard(this.deck.dealACard());
	    this.human = new HumanPlayer(this.deck, this.pile, this.fview);
	    this.computer = new ComputerPlayer(this.deck, this.pile, this.fview);
        
        //this.fview.displayPileTopCard(this.pile.getTopCard());
        this.fview.displayComputerHand(this.computer.getHandCopy());
        this.fview.displayHumanHand(this.human.getHandCopy());
        return;
    }
    
    goOnline(){//set up go fish for online play
        this.fview.eraseHands();
        this.fview.removeEvents();
    }


}