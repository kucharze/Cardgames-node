/**
 * Deck of playing cards.
 */
if (typeof Card === "undefined") {
  Card = require('./Card');
}
class Deck {
  // Instance variable:
  //   list: Deck of cards (array of Card objects)

  /**
   * Initialize deck to represent regular 52 playing cards.
   */
  constructor() {
    this.list = new Array();
    let suit = ["c", "d", "h", "s"];
    let value = ["2", "3", "4", "5", "6", "7", "8", "9", "10",
       	         "j", "q", "k", "a"];
    for (let i=0; i<suit.length; i++) {
      for (let j=0; j<value.length; j++) {
        this.list.push(new Card(suit[i],value[j]));
      }
    }
  }
  /*
   * Shuffle the deck.
   */
  shuffle() {
    for (let n=this.list.length; n>=2; n--) {
      let r = Math.floor(Math.random()*n);
      // Swap cards at r and n-1
      let card = this.list[r];
      this.list[r] = this.list[n-1];
      this.list[n-1] = card;
    }
  }
  /**
   * Remove top card from the deck and return it.
   */
  dealACard() {
    return this.list.shift();
  }

  getSize(){
    return this.list.length;
  }
    
    /**
    * Determines if the deck is empty.
    */
    isEmpty(){
        return this.list.length==0;
    }
    
    /**
    * Adds a card to the deck.
    */
    addACard(card){
        this.list.push(card);
    }
  /**
   * Indicate whether or not top card of deck is an 8.
   * This method is intended to be used only during game
   * initialization to avoid starting the pile with an 8.
   */
  isTopCardAnEight() {
    return this.list[0].getValue() == "8";
  }
}
if (typeof module === "object") {
   module.exports = Deck;
}
