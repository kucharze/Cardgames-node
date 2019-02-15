/**
 * Discard pile of cards.
 */
class Pile {

  // Instance variables:
  //   list: List of cards on the pile (array of Card)
  //   announcedSuit: If an 8 is played, this is the announced suit 
  //                  preference (String)

  constructor() {
    this.list = new Array();
    this.announcedSuit = "";
  }
  /**
   * Return true if the given card can be legally played on the
   * current pile.
   */
  isValidToPlay(card) {
    let retVal = false;
    let topCard = this.getTopCard();

    if (card.getValue() == "8") {
      retVal = true;
    }
    else if (topCard.getValue() == "8") {
      retVal = (card.getSuit() == this.announcedSuit);
    }
    else if (card.getSuit() == topCard.getSuit()
               || 
             card.getValue() == topCard.getValue()) {
      retVal = true;
    }
    return retVal;
  }
    
    isEmpty(){
        return this.list.length==0;
    }
    
    empty(){
        alert("emptying the pile");
        while(this.list.length>0){
            this.list.splice(0,1);
        }
    }
    
  /**
   * Accept a card and make it the new top of the discard pile.
   */
  acceptACard(card) {
    this.list.unshift(card);
  }
  /**
   * Remember the suit preference announced when the most recent
   * 8 was played.
   */ 
  setAnnouncedSuit(suit) {
    this.announcedSuit = suit;
  }
  /**
   * Return the card that is on top of the pile.  The card is not removed.
   */
  getTopCard() {
    return this.list[0];
  }
}
if (typeof module === "object") {
   module.exports = Pile;
}
