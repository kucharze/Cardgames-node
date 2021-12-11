<<<<<<< HEAD
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

=======
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

>>>>>>> d9aaf81508c69cc2625d30ba3882b9f6279fe8ad
}