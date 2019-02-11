/**
 * A single playing card  
 */
class Card {

  // Instance variables
  //   suit: Suit of this card (String)
  //   value: Numeric or face value of this card (String)
  //   pixelOffset: Display parameter (Number; distance each card in a hand 
  //                is offset from its neighbors)

  constructor (aSuit, aValue) {
      this.suit = aSuit;
      this.value = aValue;
      this.pixelOffset = 15;
      this.flipped=false;
      this.jackValue = 0;
      this.sValue = 0;
      this.warValue=0;
      this.setValues(aValue);
  }
    
    setValues(aValue){//Used to set card values for use in certain games
        if(aValue=="k"){
            this.jackValue=10;
            this.sValue=13;
            this.warValue=13;
        }
        else if(aValue=="j"){
            this.jackValue=10;
            this.sValue=11;
            this.warValue=11;
        }
        else if(aValue=="q"){
            this.jackValue=10;
            this.sValue=12;
            this.warValue=12;
        }
        else if(aValue=="a"){
            this.jackValue=11;
            this.sValue=1;
            this.warValue=14;
        }
        else{
            this.jackValue=aValue;
            this.sValue=aValue;
            this.warValue=aValue;
        }
    }
    
  getSuit() { return this.suit; }
  getValue() { return this.value; }
    getSValue(){return this.sValue;}
    getJackValue(){return this.jackValue;}
    getWarValue(){return this.warValue;}
    
    flip(){
        this.flipped=!this.flipped;
    }
  /**
   * Return a string representation of this card.
   */
  toString() {
    return this.value + this.suit ;
  }
  /**
   * Return relative URL of this card (assumes certain folder structure).
   */
  getURL() { 
    return "../images/PlayingCards/" + this.toString() + ".png";
  }
  /**
   * Return relative URL of back of this (or any) card 
   * (assumes certain folder structure).
   */
  getBackURL() { 
    return "../images/PlayingCards/back.png";
  }
}
if (typeof module === "object") {
   module.exports = Card;
}