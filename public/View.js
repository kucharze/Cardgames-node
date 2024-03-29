/**
 * Provide methods that use the system I/O to interact with the user.
 * This implementation uses the JavaScript window.prompt() method
 * for input (and some output) and window.alert() for (purely) output.
 */
class View {
    constructor(presenter) {
    this.presenter = presenter;
    this.topCard = null;
    this.topCardString = "";
    //this.errorString = "";
        
    document.getElementById("deck").addEventListener("click", function(){presenter.cardPicked();})
    document.getElementById("suitPicker").addEventListener("click", function() {presenter.suitPicked(event.target.id);});
    document.getElementById("yourHand").addEventListener("click",function(){
        let cardString=event.target.title;
        if (cardString) {
          presenter.cardSelected(cardString);
        }
    });
  }

  announceWinner(winner){
    let winPlayer = document.getElementById("status");
    //winPlayer.innerHTML = "Finding a winner: " + winner;

    if(+(winner) === +(1)){
      winPlayer.innerHTML = "Congratulations! You win!";
    }
    else{
      winPlayer.innerHTML = "Thanks for being a good loser";
    }

  }

  displayComputerHand(hand){//only needed for load up
    let cpu = document.querySelector("#myHand");
    while(cpu.hasChildNodes()){
	    cpu.removeChild(cpu.lastChild);
    }
      
  for(let i=0; i<hand.length; i++){
    let image=document.createElement("img");
	  image.src ="./Images/cardback.png";
    //image.src ="./Images/"+hand[i].toString()+".png";
	  image.title="Card Back";
    image.id=hand[i].toString()+"E";
	  image.class="card positionable";
	  image.style="position:absolute; left:"+  (30*i) + "px; z-index:" + i +" hieght:10px";
	  cpu.appendChild(image);
    }
  }

  displayHumanHand(hand){//Only needed for load up
    let human = document.querySelector("#yourHand");
    while(human.hasChildNodes()){
	    human.removeChild(human.lastChild);
    }
    for(let i=0; i<hand.length; i++){
        let image=document.createElement("img");
	      image.src ="./Images/"+hand[i].toString()+".png";
	      image.title=hand[i].toString();
        image.id=hand[i].toString()+"E";
	      image.class="card positionable";
	      image.style="position:absolute; left:"+ (30*i) + "px; z-index:" + i +"";
        human.appendChild(image);
    }
  }
    
    addComCard(card,numCards){
      let cpu = document.querySelector("#myHand");
      let image=document.createElement("img");
	    image.src ="./Images/cardback.png";
	    image.title="Card Back";
      image.id=card.toString()+"E";
	    image.class="card positionable";
	    image.style="position:absolute; left:"+  (-30) + "px; z-index:" + numCards +" hieght:10px";
	    cpu.appendChild(image);
      this.moveCard(image,(30*(numCards-1)),-30);
    }
    
    addHumanCard(card,numCards){//Have a card move in from offscreen
      let human=document.querySelector("#yourHand");
      let image=document.createElement("img");
	    image.src ="./Images/"+card.toString()+".png";
	    image.title=card.toString();
      image.id=card.toString()+"E";
	    image.class="card positionable";
	    image.style="position:absolute; left:"+ (-30) + "px; z-index:" + numCards +"";
      human.appendChild(image);
      this.moveCard(image,(30*(numCards-1)));
    }
    
    moveCard(image,pos){//for handling card animations
      $(image).animate({left: pos},800);
    }
    
    eraseHands(){
      let human=document.querySelector("#yourHand");
      let computer=document.querySelector("#myHand");
      while(human.hasChildNodes()){
        human.removeChild(human.lastChild);
      }
      while(computer.hasChildNodes()){
	      computer.removeChild(computer.lastChild);
      }
    }

  //display the top card of the pile
  displayPileTopCard(card){
	 let table=document.querySelector("#table");
	 table.removeChild(document.getElementById("pile"));
	 let pile = document.getElementById("pile")
   this.topCard=card;
	 let image=document.createElement("img");
	 image.src ="./Images/"+card.toString()+".png";
	 image.id="pile";
	 image.title=this.topCard.getValue()+this.topCard.getSuit();
	 image.class="card positionable";
	 image.style="position:absolute; left:"+ (-30) + "px; z-index:" + 1 +"";
	 table.appendChild(image);
   this.moveCard(image,100);
  }
    /*
    moveToPile(image,ileft,itop,left,top){//move a card to the pile
        alert("Moving to pile");
        let pile=document.getElementById("pile");
        image.style.top=(i-5)+"px";
        if(i<pos){
            setTimeout(()=> {
                //console.log("timeout function");
                this.moveCard(image,i-5,pos);
            },30);
        }
    }
    */
 /**
   * Event handler for preventing click processing.
   * @param {Event} event - DOM Event object.
   */
  clickBlocker(event) {
    event.stopPropagation();
  }
    
  blockPlay() {
    //alert("attempting to block play");
    // Capture and ignore all clicks
    document.getElementById("allCards").addEventListener("click", this.clickBlocker, true);
    // Dim the cards to indicate that play is blocked.
    //document.getElementById("allCards").style.opacity = 0.5;
  }
  
  /**
   * Unblock user from playing.
  */
  unblockPlay() {
  //alert("attempting to unblock play");
  // Remove capturing listener
  document.getElementById("allCards").removeEventListener("click", this.clickBlocker, true);
  // Undim the cards to indicate that play is no longer blocked.
  //document.getElementById("allCards").style.opacity = 1.0;
}

//makes the suit picker vissible
displaySuitPicker(){
  document.getElementById("suitPicker").style= " display: block";
  this.blockPlay();
}

//makes the suit picker invisible again
undisplaySuitPicker(){
  document.getElementById("suitPicker").style= " display: none";
  this.unblockPlay();
}

  displayWrongCardMsg(cardstring){
    let message=document.getElementById("status");
    message.innerHTML="Can't play " +cardstring+", try again";
  }
    
  displayMessage(message){
    let mes=document.getElementById("status");
    mes.innerHTML=message;
  }
    
  displaySuit(suitstring){
    let suit=document.getElementById("Suit");
    
    if(suitstring=="h"){
      suit.innerHTML="Current Suit: Hearts";
    }
    if(suitstring=="d"){
      suit.innerHTML="Current Suit: Diamonds";
    }
    if(suitstring=="c"){
      suit.innerHTML="Current Suit: Clubs";
    }
    if(suitstring=="s"){
      suit.innerHTML="Current Suit: Spades";
    }
    
  }
    
    removeEvents(){//remove event listeners to set up for online play
        var old1 = document.getElementById("deck");
        var old2 = document.getElementById("suitPicker");
        var old3 = document.getElementById("yourHand");
        
        var new1 = old1.cloneNode(true);
        var new2 = old2.cloneNode(true);
        var new3 = old3.cloneNode(true);
        
        old1.parentNode.replaceChild(new1, old1);
        old2.parentNode.replaceChild(new2, old2);
        old3.parentNode.replaceChild(new3, old3);
    }

}