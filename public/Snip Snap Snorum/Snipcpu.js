<<<<<<< HEAD
/**
 * The computer player's hand and playing logic.
 */
class Snipcpu extends Player{
  /**
   * Record arguments for later use.
   * @param {Deck} deck - The deck of cards used for this game.
   * @param {Pile} pile - The discard pile.
   * @param {View} view - The View object used for all user interaction.
   */
  constructor(deck, pile, view) {
      super(deck);
      this.deck = deck;
      this.pile = pile;
      this.view = view;
      this.played=false;
  }
    
    addCards(){
        for(var i=0; i<15; i++){
            this.list.push(this.deck.dealACard());
        }
    }
    
    hasCard(card){//checks to see if the computer has a given card
        let hand= this.getHandCopy();
        
        for(var i=0; i<hand.length; i++){
            if(hand[i].getValue() == card.getValue()){
                return true;
            }
        }
        return false;
    }
    
=======
/**
 * The computer player's hand and playing logic.
 */
class Snipcpu extends Player{
  /**
   * Record arguments for later use.
   * @param {Deck} deck - The deck of cards used for this game.
   * @param {Pile} pile - The discard pile.
   * @param {View} view - The View object used for all user interaction.
   */
  constructor(deck, pile, view) {
      super(deck);
      this.deck = deck;
      this.pile = pile;
      this.view = view;
      this.played=false;
  }
    
    addCards(){
        for(var i=0; i<15; i++){
            this.list.push(this.deck.dealACard());
        }
    }
    
    hasCard(card){//checks to see if the computer has a given card
        let hand= this.getHandCopy();
        
        for(var i=0; i<hand.length; i++){
            if(hand[i].getValue() == card.getValue()){
                return true;
            }
        }
        return false;
    }
    
>>>>>>> d9aaf81508c69cc2625d30ba3882b9f6279fe8ad
}