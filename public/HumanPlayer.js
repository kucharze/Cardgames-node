/**
 * Interact with the human player to obtain their desired play.
 */
class HumanPlayer extends Player {

    constructor(deck, pile, view) {
	    super(deck);
        this.deck = deck;
	    this.pile = pile;
	    this.view = view;
        
        //True if it is the players turn to ask opponent for a card
        this.fish=true;
    }

  cardPicked(){
      let newCard=this.deck.dealACard(); 
      this.list.push(newCard);
      this.view.addHumanCard(newCard,this.list.length);
  }
    fishCardPicked(){
      let newCard=this.deck.dealACard(); 
      this.list.push(newCard);
      //this.view.addHumanCard(newCard,this.list.length);
      this.view.displayHumanHand(this.getHandCopy());
  }

  cardSelected(cardString){
      let moving=true;
	let card = this.find(cardString);
      let image=document.getElementById(cardString+"E");
      let pimage=document.getElementById("pile");
	//let d=document.getElementsByTagName(cardString+"E");
    //picked an ineligible card to play
	if ((card == null || !this.pile.isValidToPlay(card))) {
	    this.view.displayWrongCardMsg(cardString);
	    return false;  //Call cardPicked() after user selects a different card
	}
	else {//card is eligible to play
        let suit=card.getSuit();
        //this.view.moveToPile(d);
	    this.remove(this.list.indexOf(card));
        this.pile.acceptACard(card);
        //setTimeout(()=> {
	           this.view.displayPileTopCard(card);
	           this.view.displayHumanHand(this.getHandCopy());
               // moving=false;
                //alert("moved");
           // },3000);
	           if (card.getValue() === "8") {//user played an eight
		          this.view.displaySuitPicker();
		          return false;
		      // Continue after user picks a suit.
	           }
                this.view.displaySuit(card.getSuit());
	           return true;
	   }
    }
    
    nullifyCard(){
        this.fishCard=null;
        this.fishCards.splice(0);
    }
    
    fish(cardString){
        if(this.hasDuplicate()){
            this.view.displayDupCardMsg();
            //let dup=this.findDups();
            //this.removeDups(dup);
            return null;
        }
        let card =this.find(cardString);
        if((card == null)){
            this.view.displayWrongCardMsg(cardString);
            //this.remove(this.list.indexOf(card));
            return null;
        }else{
            return card;
            //presenter.askComputerforcard
        }
    }
    
    give(cardString, comCard){
        let card=this.find(cardString);
        if((card==null || (card.getValue() != comCard.getValue()))){
           this.view.displayWrongCardMsg(comCard);
            return false;
        }
        else{
            this.fishCard=card;
            this.remove(this.list.indexOf(card));
            //this.pile.acceptACard(card);
            this.view.displayHumanHand(this.getHandCopy());
            return true;
        }
    }

  suitPicked(suit){
       if (!(suit === "c" || suit === "d" ||
          suit === "h" || suit === "s")) {
          return false; // Have the user pick different suit.
	}
      this.pile.setAnnouncedSuit(suit);
      this.view.undisplaySuitPicker();
      return true;
  }

}