/** 
 * Base class for players.  Initializes player's hand and provides
 * several utility methods related to maintaining and searching a hand.
 */
class Player {
  constructor(deck) {
      //this.i=0;
    /** This player's hand. */
    this.list = new Array();

    // Get seven cards from the deck and store them in this hand.
    for (let i=1; i<=7; i++) {
      this.list.push(deck.dealACard());
    } 
  }
  /**
   * Return true when this hand is empty.
   */
  isHandEmpty() {  
    return this.list.length == 0;
  }
    
  /*Returns true if hand has two of the same value*/  
    countCards(){
        //let dup=false;
        let hand=this.getHandCopy();
        
        for(var i=0; i<hand.length; i++){
            
        }
        return false;
    }
    
    /*Find the duplicates in a hand*/
    countCard(card){//Count occurences of a single card
        let hand=this.getHandCopy();
        var tot=0;
        for(let i=0; i<hand.length; i++){
            
        }
        return tot++;
    }
    
    
  /**
   * Add the given Card object to this player's hand.
   */
  add(card) {
    this.list.push(card);
  }
  /**
   * Remove the card at the specified position (0-based) in
   * this player's hand.
   */
  remove(i) {
      //alert("Removing a card "+i);
      //this.i++;
     this.list.splice(i,1);
  }
    
    removeAll(card){
        var spots=[];
        let hand=this.getHandCopy();
        
        for(var i=0; i<hand.length; i++){
            if(hand[i].getValue() == card.getValue()){
                spots.push(i);
            }
        }
        
        for(var i=0; i<spots.length; i++){
            this.list.splice(i,1);
        }
    }
    
    findValue(cardvalue){
        let i = 0;
        let card = null;
        while (i<this.list.length && !card) {
            if (this.list[i].getValue() == cardvalue) {
                card = this.list[i];
            }
            i++;
        }
        return card;
    }
    
    findSuit(cardsuit){
        
    }
  /**
   * Given the string specification of a card,
   * return the card if it is in this player's hand
   * or return null.
   */
  find(cardString) {
    let i = 0;
    let card = null;
    while (i<this.list.length && !card) {
      if (this.list[i].toString() == cardString) {
        card = this.list[i];
      }
      i++;
    }
    return card;
  }
  /**
   * Return index of given Card object, or -1 if card not in hand.
   */
  indexOf(card) {
      //alert("Finding index of card");
     return this.list.indexOf(card);
  }
    
  /**
   * Return copy of this player's hand (array of Card objects).
   * Changes to the returned array will not affect the Player's hand.
   */
  getHandCopy() {
    return this.list.slice(0);
  }
   /**
   * Set this player's hand to the specified array of cards.
   * @param {Card[]} - Array of cards that will become this player's hand.
   */
  setHand(hand) {
    this.list = hand;
  }
}
if (typeof module === "object") {
   module.exports = Player;
}
