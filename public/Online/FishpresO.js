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
        this.turnToFish=true;
        this.giveCards=[];
        
	    this.human = new HumanPlayer8O(this.deck, this.pile, this.fview);
        
        this.ws=socket;
    }
    
    goFish(){
        let mes={};
        mes.action="Go Fish";
        if(this.turnToFish){
            this.fview.displayMessage("Cannot do that right now");
            return;
        }
        else{
            if(this.human.findValue(this.askCard.getValue())!=null ){
                this.fview.displayMessage("You have a "+this.askCard.getValue()+ " that you can give");
                return;
            }
            else{
                mes.gameact="";
            }
            this.human.fish=true;
            //this.fview.displayMessage("Pick a card to ask for");
        }
    }
    
    //either ask for a card or give a card to the opponent
    fish(cardstring){
        let card=this.human.find(cardstring);
        let mes={};
        mes.action="Go Fish";
        
        if(!this.turnToFish){//For giving a card to the computer
            if(this.human.give(cardstring, this.askCard)){
                this.giveCards.push(card);
                
                if(this.human.findValue(this.askCard.getValue())!=null ){
                    //player still has cards that he she can play
                    alert("You still have more cards to play");
                    return;
                }
                
                this.turnToFish=true;
                mes.gameact="Give a card";
                mes.hand=this.human.getHandCopy();
                mes.cardsToGive=this.giveCards;
                mes.fish=true;
                mes.numCards=this.human.getHandCopy().length;
                this.ws.send(JSON.stringify(mes));
            }
            
            return;
        }
        else{//Asking for a card from the computer
            if(card==null){
                return;
            }
            
            mes.gameact="ask for card";
            mes.askCard=card;
            mes.hand=this.human.getHandCopy();
            mes.fish=false;
            
            this.ws.send(JSON.stringify(mes));
            
            
            this.turnToFish=false;
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
        this.turnToFish=message.fish;
        if(message.askCard!=null){
            let askCard=message.askCard;
            this.askCard= new Card(askCard.suit, askCard.value);
        }
        
        
	    this.human.setHand(newHand);
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