/** 
 * Base class for players.  Initializes player's hand and provides
 * several utility methods related to maintaining and searching a hand.
 */
class Player {
  constructor(deck) {
      this.i=0;
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
    hasDuplicate(){
        //let dup=false;
        let hand=this.getHandCopy();
        
        for(var i=0; i<hand.length; i++){
            for(var j=(i+1); j<hand.length; j++){
                if(hand[i].getValue() == hand[j].getValue()){
                    return true;
                }
            }
        }
        return false;
    }
    
    /*Find the duplicates in a hand*/
    findDups(){
        let hand=this.getHandCopy();
        
        for(let i=0; i<hand.length; i++){
            for(let j=(i+1); j<hand.length; j++){
                if(hand[i].getValue() == hand[j].getValue()){
                    return hand[i].getValue();
                }
            }
        }
        return null;
    }
    
    //remove duplicate cards from hand
    removeDups(){
        let removed=false;
        let hand=this.getHandCopy();
        while(this.hasDuplicate()){
            for(let i=0; i<hand.length; i++){
                for(let j=(i+1); j<hand.length; j++){
                    if(hand[i].getValue() == hand[j].getValue()){
                        this.remove(this.list.indexOf(hand[i]));
                        this.remove(this.list.indexOf(hand[j]));
                        removed=true;
                        break;
                    }
                    if(removed){
                        removed=false;
                        break;
                    }
                }
            }
        }
        
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
      this.i++;
     this.list.splice(i,1);
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
}
if (typeof module === "object") {
   module.exports = Player;
}
