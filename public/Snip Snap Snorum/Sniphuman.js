/**
 * Interact with the human player to obtain their desired play.
 */
class Sniphuman extends Player {

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

}