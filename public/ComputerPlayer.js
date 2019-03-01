/**
 * The computer player's hand and playing logic.
 */
class ComputerPlayer extends Player{
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
      
      //to keep track of card suit values in Crazy Eights
      this.hearts=0;
      this.clubs=0;
      this.diamonds=0;
      this.spades=0;
      
      //So that we can move cards around in Go fish
      this.fishCard=null;
      this.fishCards=[];
  }
    
    cardPicked(){
        this.list.push(this.deck.dealACard());
        this.view.displayComputerHand(this.getHandCopy());
    }
  /**
   * Play for the computer, updating the computer's hand as well as
   * the deck and pile as appropriate.  In this version, the computer 
   * always plays the first card in its hand that is playable.  If it 
   * plays an 8, the suit "announced" is the suit on the card.  This
   * method does not update the display; that is handled by the Presenter.
   */
  takeATurn() {
    // Play the first playable card, or pick if none is playable.
    let i=0;
    let eight=-1;
    let e=false;
    let hand = this.getHandCopy(); // copy of hand for convenience
    let card = hand[0];
    let playeight=false;
      let change=true;
      for(i=0; i<hand.length; i++){//Update to make computer play an 8 only if it cant play anything else
          card=hand[i];
          if(card.getValue()=="8"){
              eight=i;
              e=true;
              continue;
          }
          if(this.pile.isValidToPlay(card)){
              change=false;
              break;
          }
      }
      
     if(e){
         if(change){
             playeight=true;
         }
     }
     
     // actual hand will change below, so don't continue to use copy
      if(playeight){
          //card=hand[eight];
          hand = null;
          //alert("Computer is playing an eight");
          this.remove(eight);
          this.pile.acceptACard(card);
          this.view.displayPileTopCard(card);
          let suit="the suit";
          this.countCards();
          if(this.hearts>=this.diamonds && this.hearts>=this.spades && this.hearts>=this.clubs){//Mostly has hearts
              this.pile.setAnnouncedSuit("h");
              this.view.displaySuit("h");
          }
          else if(this.diamonds>=this.hearts && this.diamonds>=this.spades && this.diamonds>=this.clubs){//Mostly has hearts
              this.pile.setAnnouncedSuit("d");
              this.view.displaySuit("d");
          }
          else if(this.clubs>=this.diamonds && this.clubs>=this.spades && this.clubs>=this.hearts){//Mostly has hearts
              this.pile.setAnnouncedSuit("c");
              this.view.displaySuit("c");
          }
          else if(this.spades>=this.diamonds && this.spades>=this.hearts && this.spades>=this.clubs){//Mostly has hearts
              this.pile.setAnnouncedSuit("s");
              this.view.displaySuit("s");
          }
          //this.pile.setAnnouncedSuit(card.getSuit());
          //this.view.displaySuit(card.getSuit());
          this.view.displayComputerHand(this.getHandCopy());
      }
      else{
        hand = null;
        if (this.pile.isValidToPlay(card)) {
            this.remove(i);
            this.pile.acceptACard(card);
            this.view.displayPileTopCard(card);
            this.view.displaySuit(card.getSuit());
            this.view.displayComputerHand(this.getHandCopy());
        }
        else {
            this.add(this.deck.dealACard());
            this.view.displayComputerHand(this.getHandCopy());
        }
    }
  }
    
    countCards(){
        let hand=this.getHandCopy();
        for(let i=0; i<hand.length; i++){
            if(hand[i].suit=="h"){
                this.hearts=this.hearts+1;
            }
            if(hand[i].suit=="d"){
                this.diamonds=this.diamonds+1;
            }
            if(hand[i].suit=="s"){
                this.spades=this.spades+1;
            }
            if(hand[i].suit=="c"){
                this.clubs=this.clubs+1;
            }
        }
    }
    
    nullifyCard(){
        this.fishCard=null;
        this.fishCards.splice(0);
    }
  
    fish(){
        let hand=this.getHandCopy();
        //Randomly chose anumber between 0 and handsize -1
        let ran=Math.floor((Math.random() * (hand.length-1)) + 0);
        //ask human for card of value the same as the card that was randomly chosen
        return hand[ran];
    }
    
    give(card){
        let hand=this.getHandCopy();
        let removed = false;
        for(var i=0; i<hand.length; i++){
            if(hand[i].getValue()==card.getValue()){
                //this.pile.acceptACard(hand[i]);
                this.fishCard=hand[i];
                this.fishCards.push(hand[i]);
                //this.remove(i);
                this.view.displayComputerHand(this.getHandCopy());
                removed = true;
            }
        }
        this.removeAll(card);
        return removed;
    }
    
}