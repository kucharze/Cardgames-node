/**
 * Setting up Crazy Eights human vs computer
 */
class Jackpres {
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
        this.socket=ws;
        
	    this.jview = new Jackview(this);
        this.jplayer=new Jackplayer(this.deck1,false);//the player
        this.dealer=new Jackplayer(this.cdeck,true);//the computer/dealer
    }

    displayPlayerValue(){
        this.jplayer.findValue();
        let v= this.jplayer.getValue();
        document.getElementById("Hand value").innerHTML=v;
    }

    displayDelearValue(){
        this.dealer.findValue();
        let v=this.dealer.getValue();
        document.getElementById("Dealer value").innerHTML=v;
    }
    
    hit(){
        let obj={};
        this.jplayer.findValue();
        //alert("player value "+this.jplayer.getValue());
        if(this.jplayer.value == 21){
            if(+this.jplayer.getlength() == +2){ //Player has a blackjack
                this.blackjack(this.jplayer);
            }
            else{
                this.dealerturn();
            }
            // this.blackjack(this.jplayer);
            // this.jview.displayMessage("You have a blackjack");
            // document.getElementById("hit").disabled=true;
            // document.getElementById("stand").disabled=true;
            // this.dealer.list[0].flip();
            // obj.action="Blackjack";
            // obj.result="win";
            // this.socket.send(JSON.stringify(obj));
            // this.jview.displayComputerHand(this.dealer.getHandCopy());
            return;
        }
        let newCard=this.deck1.dealACard();
        this.jplayer.add(newCard);
        this.jview.addHumanCard(newCard,this.jplayer.list.length);
        //this.jview.displayHumanHand(this.jplayer.getHandCopy());
        this.displayPlayerValue();
        
            
        if(this.jplayer.value>21){//Player hand value over 21
            this.displayDelearValue();
            this.jview.displayMessage("You have busted");
            document.getElementById("hit").disabled=true;
            document.getElementById("stand").disabled=true;
            this.dealer.list[0].flip();

            obj.action="Blackjack";
            obj.result="loss";
            this.socket.send(JSON.stringify(obj));
            this.jview.displayComputerHand(this.dealer.getHandCopy());
        }
            
    }
    
    stand(){
        //this.jplayer.findValue();
        //alert("player value "+this.jplayer.value);
        let obj={};
        if(this.jplayer.value == 21){
            // this.displayDelearValue();
            // this.dealer.list[0].flip();

            if(+this.jplayer.getlength() == +2){ //Player has a blackjack
                this.blackjack(this.jplayer);
            }
            else{
                this.dealerturn();
            }

            // this.jview.displayMessage("You have a blackjack");
            // document.getElementById("hit").disabled=true;
            // document.getElementById("stand").disabled=true;
            
            // this.jview.displayComputerHand(this.dealer.getHandCopy());
            // obj.action="Blackjack";
            // obj.result="win";
            // this.socket.send(JSON.stringify(obj));
            return;
        }
        //alert("Player has decided to stand");
        this.dealerturn();
        
        return;
    }

    //Process logic for the player having a blackjack
    blackjack(player){
        if(player==this.jplayer){
            this.displayDelearValue();
            this.dealer.list[0].flip();

            this.jview.displayMessage("You have a called blackjack");
            document.getElementById("hit").disabled=true;
            document.getElementById("stand").disabled=true;

            obj.action="Blackjack";
            obj.result="win";
            this.socket.send(JSON.stringify(obj));
            this.jview.displayComputerHand(this.dealer.getHandCopy());
        }
        else{
            this.jview.displayMessage("Dealer has a blackjack");
            document.getElementById("hit").disabled=true;
            document.getElementById("stand").disabled=true;

            obj.action="Blackjack";
            obj.result="loss";
            this.socket.send(JSON.stringify(obj));
        }
        
        return;
    }

    //Process logic for the dealer's turn
    dealerturn(){
        this.dealer.list[0].flip();
        this.jview.displayComputerHand(this.dealer.getHandCopy());
        this.displayDelearValue();
        
        if(this.dealer.value == 21  && this.dealer.getlength() == 2){
            this.blackjack(this.dealer);
            return;
            
            
            // this.jview.displayMessage("Dealer has a blackjack");
            // document.getElementById("hit").disabled=true;
            // document.getElementById("stand").disabled=true;
            // obj.action="Blackjack";
            // obj.result="loss";
            // this.socket.send(JSON.stringify(obj));
        }
        
        //alert("dealer value is "+ this.dealer.value);
        while(this.dealer.value < 17){//dealer hand value over 21
            let newCard=this.cdeck.dealACard();
            this.dealer.add(newCard);
            this.jview.addComCard(newCard,this.dealer.list.length);
            this.displayDelearValue();
            
        }
        //this.jview.displayComputerHand(this.dealer.getHandCopy());
        //alert("The dealer hand value is now" +this.dealer.value);
        
        document.getElementById("hit").disabled=true;
        document.getElementById("stand").disabled=true;
        this.displayDelearValue();
        this.displayPlayerValue();
        
        if(this.dealer.value>21){
            this.jview.displayMessage("Player wins, dealer has busted");
            obj.action="Blackjack";
            obj.result="win";
            this.socket.send(JSON.stringify(obj));
            return;
        }
        else{            
            if((this.dealer.value) >= (this.jplayer.value)){
                this.jview.displayMessage("Dealer wins");
                obj.action="Blackjack";
                obj.result="loss";
                this.socket.send(JSON.stringify(obj));
            }
            else if((this.dealer.value) < (this.jplayer.value)){
                this.jview.displayMessage("Player wins");
                obj.action="Blackjack";
                obj.result="win";
                this.socket.send(JSON.stringify(obj));
            }
        }
        return;
    }
    

//Sets up the start of the game
 play(){//Set up for playing crazy eights
     this.jview.displayComputerHand(this.dealer.getHandCopy());
     this.jview.displayHumanHand(this.jplayer.getHandCopy());
     this.displayPlayerValue();
     
     return;
 }
    
    resetGame(){//Resets the game with a new deck and players
        this.jview.eraseHands();
        this.deck1=new Deck();
        this.cdeck=new Deck();
        this.deck1.shuffle();
        this.deck1.shuffle();
        this.cdeck.shuffle();
        this.cdeck.shuffle();
        
        document.getElementById("hit").disabled=false;
        document.getElementById("stand").disabled=false;
        
	    this.jplayer = new Jackplayer(this.deck1, false);
	    this.dealer = new Jackplayer(this.cdeck, true);
        //this.view.displayPileTopCard(this.pile.getTopCard());
        this.jview.displayComputerHand(this.dealer.getHandCopy());
        this.jview.displayHumanHand(this.jplayer.getHandCopy());

        this.displayPlayerValue();
        document.getElementById("Dealer value").innerHTML="";
        
        this.jview.displayMessage("Welcome to Blackjack");
            
        return;
    }

}