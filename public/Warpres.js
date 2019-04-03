/**
 * Setting up Crazy Eights human vs computer
 */
class Warpres {
    /**
     * Initialize game by creating and shuffling the deck,
     * dealing one card (other than an 8) to the discard pile,
     * and dealing 7 cards to each player.
     */
    constructor(ws) {
        //this.moves=0;
	    this.deck1 = new Deck();
	    this.deck1.shuffle();
        this.deck1.shuffle();
        this.cdeck=new Deck();
        this.cdeck.shuffle();
        this.cdeck.shuffle();
        this.humanscore=0;
        this.computerscore=0;
        this.socket=ws;
        
	    this.pile = new Pile();
	    //this.pile.acceptACard(this.deck.dealACard());
	    this.wview = new Warview(this);
	    this.human=new HumanPlayer(this.deck1, this.pile, this.view);
	    this.computer=new ComputerPlayer(this.cdeck, this.pile, this.view);
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
    
    dealCards(){
        let obj={};
        if(this.deck1.list.length<4){
            this.wview.disablePlay();
            obj.action="War";
            obj.wins=this.humanscore;
            obj.losses=this.computerscore;
            this.socket.send(JSON.stringify(obj));
            this.wview.displayMessage("Player:" + this.humanscore + " Computer:"+this.computerscore+" Decks are empty please reset game");
            this.wview.disablePlay();
            return;
        }
        
        //alert("Dealing the cards");
        this.wview.displayMessage("Dealing the cards");
        let humancard=this.deck1.dealACard();
        let computercard=this.cdeck.dealACard();
        this.wview.displayHumanCard(humancard);
        this.wview.displayComputerCard(computercard);
        if(humancard.warValue > computercard.warValue){
            this.humanscore++;
            if((this.deck1.isEmpty()) || (this.cdeck.isEmpty())){
                obj.action="War";
                obj.wins=this.humanscore;
                obj.losses=this.computerscore;
                this.socket.send(JSON.stringify(obj));
                this.wview.displayMessage("Player:" + this.humanscore + " Computer:"+this.computerscore+" Decks are empty please reset game");
                this.wview.disablePlay();
                return;
            }
        }
        else if(computercard.warValue > humancard.warValue){
            this.computerscore++;
            if((this.deck1.isEmpty()) || (this.cdeck.isEmpty())){
                let obj={};
                obj.action="War";
                obj.wins=this.humanscore;
                obj.losses=this.computerscore;
                this.socket.send(JSON.stringify(obj));
                this.wview.displayMessage("Player:" + this.humanscore + " Computer:"+this.computerscore+" Decks are empty please reset game");
                this.wview.disablePlay();
                return;
            }
        }
        else{
            this.war();
        }
        this.wview.displayMessage("Player:" + this.humanscore + " Computer:"+this.computerscore);
    }
    
    war(){
        let humandown=this.deck1.dealACard();
        let humanwar=this.deck1.dealACard();
        
        let comdown=this.cdeck.dealACard();
        let comwar=this.cdeck.dealACard();
        
        this.wview.displayHumanWarCards(humandown, humanwar);
        this.wview.displayComputerWarCards(comdown, comwar);
        
        if(humanwar.warValue > comwar.warValue){
            this.humanscore++;
            if((this.deck1.isEmpty()) || (this.cdeck.isEmpty())){
                obj.action="War";
                obj.wins=this.humanscore;
                obj.losses=this.computerscore;
                this.socket.send(JSON.stringify(obj));
                this.wview.displayMessage("Player:" + this.humanscore + " Computer:"+this.computerscore+" Decks are empty please reset game");
                this.wview.disablePlay();
                return;
            }
        }
        else if(comwar.warValue > humanwar.warValue){
            this.computerscore++;
            if((this.deck1.isEmpty()) || (this.cdeck.isEmpty())){
                obj.action="War";
                obj.wins=this.humanscore;
                obj.losses=this.computerscore;
                this.socket.send(JSON.stringify(obj));
                this.wview.displayMessage("Player:" + this.humanscore + " Computer:"+this.computerscore+" Decks are empty please reset game");
                this.wview.disablePlay();
                return;
            }
        }
        else{
            this.war();
        }
        this.wview.displayMessage("Player:" + this.humanscore + " Computer:"+this.computerscore);
        return;
    }
    
    resetGame(){//Resets the game with a new deck and players
        //this.view.eraseHands();
        this.wview.eraseHands();
        this.deck1 = new Deck();
	    this.deck1.shuffle();
        this.deck1.shuffle();
        this.cdeck=new Deck();
        this.cdeck.shuffle();
        this.cdeck.shuffle();
        this.humanscore=0;
        this.computerscore=0;
        //this.wview.enablePlay();
        
	    //this.pile = new Pile();
	    //this.pile.acceptACard(this.deck.dealACard())
	    this.human = new HumanPlayer(this.deck1, this.pile, this.view);
	    this.computer = new ComputerPlayer(this.cdeck, this.pile, this.view);
        
        let suit=document.getElementById("warstatus");
        suit.innerHTML="Welcome to War";
        this.computer.countCards();
        this.wview.enablePlay();
        
        return;
    }

}
if (typeof module === "object") {
   module.exports = Warpres;
}