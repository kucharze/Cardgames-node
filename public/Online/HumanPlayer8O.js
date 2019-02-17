/**
 * The human player's hand and handlers for responding to his or her actions,
 * including picking a card from the deck, selecting a card to play from
 * the hand, and selecting a suit after an 8 has been played.  These
 * methods are responsible for all updates of the view in response to
 * human player processing.
 */
class HumanPlayer extends Player {
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
  }
  /**
   * Process card selected by player from his or her hand.  If
   * the card is valid to play, remove it
   * from the player's hand, add the card to the pile, 
   * and update the view.
   * @param {string} cardString - Card selected by player.
   * @returns {boolean} true if this selection completes the player's turn and
   * false otherwise.  Reasons for false return value could be either
   * an attempt to play an invalid card, in which case this method causes
   * a wrong-card message to be displayed before returning false, 
   * or playing an 8, in which case
   * this method causes the suit picker to be displayed before returning
   * false.
   */
  cardSelected(cardString) {
    let card = this.find(cardString);
    if (!card || !this.pile.isValidToPlay(card)) {
      this.view.displayWrongCardMsg(cardString);
      return false; // user failed to select a valid card to play
    }
    this.remove(this.indexOf(card));
    this.pile.acceptACard(card);
    this.view.displayPileTopCard(this.pile.getTopCard());
    this.view.displayHumanHand(this.getHandCopy());
    if (card.getValue() == "8") {
      // Update display to show that 8 has been played from hand,
      // then display the suit-picker.
      this.view.displaySuitPicker();
      return false; // final resolution of user's play will be via suitPicked
    }
    return true;
  }
  /**
   * Record selected suit as the "announced" suit and ask view to
   * remove suit picker from the display.  This method assumes that
   * it has been passed a valid suit string ('c', 'd', 'h', or 's').
   * @param {string} suit - suit selected after playing an 8
   */
  suitPicked(suit) {
    this.pile.setAnnouncedSuit(suit);
    this.view.undisplaySuitPicker();
  }
}

