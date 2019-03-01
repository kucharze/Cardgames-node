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
        //card to have moved when playing go fish
        this.fishCard=null;
        //this.fishCards=[];//cards in go fish to have moved
    }

  cardPicked(){
    this.list.push(this.deck.dealACard());
    this.view.displayHumanHand(this.getHandCopy());
  }

  cardSelected(cardString){
	let card = this.find(cardString);
	
    //picked an ineligible card to play
	if ((card == null || !this.pile.isValidToPlay(card))) {
	    this.view.displayWrongCardMsg(cardString);
	    return false;  //Call cardPicked() after user selects a different card
	}
	else {//card is eligible to play
        let suit=card.getSuit();
	    this.remove(this.list.indexOf(card));
	    this.pile.acceptACard(card);
	    this.view.displayPileTopCard(card);
	    this.view.displayHumanHand(this.getHandCopy());
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
           this.view.displayWrongCardMsg(cardString);
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