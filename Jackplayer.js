/** 
 * Base class for players.  Initializes player's hand and provides
 * several utility methods related to maintaining and searching a hand.
 */
class Jackplayer {
  
    constructor(deck,dealer) {
    /** This player's hand. */
      this.list = new Array();
      
    // Get 2 cards from the deck and store them in this hand.
    for (let i=1; i<=2; i++) {
      this.list.push(deck.dealACard());
    }
        if(dealer==true){
             for (let i=0; i<1; i++) {
                this.list[i].flip();
            }
        }
        this.value=0;
        //this.value2=0;
        this.numAces=0;
  }
    
    findValue(){
        let hand=this.list;
        this.value=0;
        this.value2=0;
        for(let i=0; i<hand.length; i++){
            //alert(hand[i].cardValue);
            this.value=(+this.value + +hand[i].jackValue);
            //this.value2=(+this.value2 + +hand[i].jackValue2);
        }
    }
    
    hasAce(){
        let hand = this.getHandCopy();
        
        for(var i=0; i<hand.length; i++){
            if(hand[i].getValue() == "a"){
                return true;
            }
        }
        return false;
    }
    
    subtractAce(){
        this.value=this.value-10;
    }
    
    countAces(){
        let num=0;
        let hand=this.getHandCopy();
        
        for(var i=0; i<hand.length; i++){
            if(hand[i].getValue() == "a"){
                num++;
            }
        }
        return num;
    }
    
  /**
   * Add the given Card object to this player's hand.
   */
  add(card) {
    this.list.push(card);
  }
  /**
   * Remove the card in hand at the specified position (0-based).
   */
  remove(i) {
    this.list.splice(i,1);
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
