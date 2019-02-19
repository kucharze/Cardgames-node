/**
 * Provide methods that use the system I/O to interact with the user.
 * This primarily displays information graphically and uses click events
 * for input (there is one alert if the user selects the wrong card).
 */
class View8O {
  /**
   * Add event listeners to DOM elements.  The event listeners should call
   * the following methods on presenter according to which element had 
   * the event:
   * <ul><li>#deck: cardPicked()</li>
   *     <li>#yourHand: cardSelected(cardString), where cardString
   *           represents the selected card</li>
   *     <li>#suitPicker: suitPicked(suit), where suit represents
   *           the selected suit</li></ul>
   * <strong>NOTE</strong>: For technical reasons, these method calls 
   *   must be of the
   *   form presenter.cardPicked() rather than the form
   *   this.presenter.cardPicked().
   * @param {Presenter} presenter - Reference to the Presenter object.
   */
  constructor(presenter) {
    this.statusDiv = document.getElementById("status");
    this.allCardsDiv = document.querySelector("#allCards");
    this.myHandDiv = document.querySelector("#myHand");
    this.pileImg = document.querySelector("#pile");
    this.yourHandDiv = document.querySelector("#yourHand");
    this.suitPickerDiv = document.querySelector("#suitPicker");
    this.announcerDiv = document.querySelector("#announcer");
    let deckImg = document.querySelector("#deck");
    deckImg.addEventListener("click", event => 
      {presenter.cardPicked();} );
    this.yourHandDiv.addEventListener("click", event =>
      {
        let cardString = event.target.title;
        // Ignore clicks that are not on cards.
        if (cardString) {
          presenter.cardSelected(cardString);
        }
      });
    this.suitPickerDiv.addEventListener("click", event =>
      {
        let suit = event.target.id;
        // Ignore clicks that are not on suit spans.
        if (suit == 'c' || suit == 'd' || suit == 'h' || suit == 's') {
          presenter.suitPicked(suit);
        }
      } );
  }
  /**
   * Display status message.
   * @param {string} message - Description of current status.
   */
  displayStatus(message) {
    this.statusDiv.textContent = message;
  }
  /**
   * Display opponent's hand face down.
   * @param {number} numberOfCards - The number of cards in opponent's hand.
   */
  displayComputerHand(numberOfCards) {
    let hand = [];
    let card = new Card("b", "jok"); // any card will do, since showing backs
    for (let i=1; i<=numberOfCards; i++) {
      hand.push(card);
    }
    this.displayHand(hand, this.myHandDiv, false);
  }
  /**
   * Display the top card of the discard pile.
   * @param {Card} card - The card to be displayed as the top of the pile.
   */
  displayPileTopCard(card) {
    this.pileImg.src = card.getURL(); 
  }
  /**
   * Display a "wrong card" message.
   * @param {string} cardString - The wrong card that was played.
   */
  displayWrongCardMsg(cardString) {
    window.alert("Bad card choice '" + cardString + "'. Please try again.");
  }
  /**
   * Display the human hand face up.
   * @param {Card[]} hand - The human player's hand.
   */
  displayHumanHand(hand) {
    this.displayHand(hand, this.yourHandDiv, true);
  }  
  /**
   * Display a hand in a specified div, optionally face up.
   * @private
   * @param {Card[]} hand - The hand to be displayed.
   * @param {Element} div - DOM div in which hand is to be displayed.
   * @param {boolean} [faceup=false] - Whether cards should be faceup or not.
   */
  displayHand(hand, div, faceup=false) {
    // Clear any previous hand being displayed.
    while (div.children.length > 0) {
      div.removeChild(div.children[0]);
    }
    for (let i=0; i<hand.length; i++) {
      this.addCardImage(hand[i], div, faceup);
    }
  }
  /**
   * Event handler for preventing click processing.
   * @param {Event} event - DOM Event object.
   */
  clickBlocker(event) {
    event.stopPropagation();
  }
  /**
   * Block user from playing.
   */
  blockPlay() {
    // Capture and ignore all clicks
    document.getElementById("Eight").addEventListener("click", this.clickBlocker, true);
    // Dim the cards to indicate that play is blocked.
    this.allCardsDiv.style.opacity = 0.5;
  }
  /**
   * Unblock user from playing.
   */
  unblockPlay() {
    // Remove capturing listener
    document.body.removeEventListener("click", this.clickBlocker, true);
    // Undim the cards to indicate that play is no longer blocked.
    this.allCardsDiv.style.opacity = 1.0;
  }
  /**
   * Display the suit picker.
   */
  displaySuitPicker() {
    this.suitPickerDiv.style.display = "block";
  }
  /**
   * Undisplay the suit picker.
   */
  undisplaySuitPicker() {
    this.suitPickerDiv.style.display = "none";
  }
  /**
   * Add card img element to the specified div.
   * @private
   * @param {Card} card - The card to be displayed.
   * @param {Element} div - DOM div in which card is to be displayed.
   * @param {boolean} faceup - Whether card should be faceup or not.
   */
  addCardImage(card, aDiv, faceup) {
    let cardPos = aDiv.children.length; // position of this card within div
    let newImg = document.createElement("img");
    newImg.src = faceup ? card.getURL() : card.getBackURL();
    newImg.title = faceup ? card.toString() : "";
    newImg.style.left = (cardPos * Card.pixelOffset) + "px";
    newImg.style.zIndex = String(cardPos+1);
    newImg.setAttribute("class", "card positionable" + (faceup?" clickable":""));
    aDiv.appendChild(newImg);
  }
}
