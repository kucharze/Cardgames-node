/**
 * Provide methods that use the system I/O to interact with the user.
 * This implementation uses the JavaScript window.prompt() method
 * for input (and some output) and window.alert() for (purely) output.
 */
class Snipview {
    constructor(presenter) {
        this.presenter = presenter;
        this.topCard = null;
        this.topCardString = "";
        this.allCardsDiv=document.getElementById("allSnips");
        
        document.getElementById("suserhand").addEventListener("click",function(){presenter.cardSelected(event.target.title);});
  }

  displayComputerHand(hand){
     let cpu = document.getElementById("scpuhand");
     while(cpu.hasChildNodes()){
	   cpu.removeChild(cpu.lastChild);
      }
    for(let i=0; i<hand.length; i++){
       //alert("Player "+hand[i].toString());
       let image=document.createElement("img");
	   image.src ="./Images/cardback.png";
	   image.title=hand[i].toString();
	   image.class="card positionable";
	   image.style="left: "+  (15*i) + " px; z-index:" + i +" hieght:10px";
	   cpu.appendChild(image);
    }
  }

  displayHumanHand(hand){
     let human = document.getElementById("suserhand");
     while(human.hasChildNodes()){
	 human.removeChild(human.lastChild);
      }
     for(let i=0; i<hand.length; i++){
         //alert("Computer "+hand[i].toString());
         let image=document.createElement("img");
	    image.src ="./Images/"+hand[i].toString()+".png";
        image.title=hand[i].toString();
	    image.class="card positionable";
	    image.style="left: "+  (15*i) + " px; z-index:" + i +"";
	    human.appendChild(image);
   }
  }
    
  /**
   * Block user from playing.
   */
  blockPlay() {
    // Capture and ignore all clicks
    document.getElementById("allCards").addEventListener("click", this.clickBlocker, true);
    // Dim the cards to indicate that play is blocked.
    this.allCardsDiv.style.opacity = 0.5;
  }
    
  /**
   * Unblock user from playing.
   */
  unblockPlay() {
    // Remove capturing listener
    document.getElementById("allCards").removeEventListener("click", this.clickBlocker, true);
    // Undim the cards to indicate that play is no longer blocked.
    this.allCardsDiv.style.opacity = 1.0;
  }
    
    eraseHands(){
        let human=document.getElementById("suserhand");
        let computer=document.getElementById("scpuhand");
        while(human.hasChildNodes()){
            human.removeChild(human.lastChild);
        }
        while(computer.hasChildNodes()){
	       computer.removeChild(computer.lastChild);
        }
    }

  //display the top card of the pile
  displayPileTopCard(card){
	 let table=document.getElementById("stable");
	 table.removeChild(table.lastChild);
	 let pile = document.getElementById("spile")
     this.topCard=card;
	 let image=document.createElement("img");
      if(card==null){
          image.src ="./Images/cardback.png";
      }else{
          image.src ="./Images/"+card.toString()+".png";
          image.title=this.topCard.getValue()+this.topCard.getSuit();
      }
	 
	 image.id="pile";
	 image.class="card positionable";
	 image.style="left: "+  (15*2) + " px; z-index:" + 2 +"";
	 table.appendChild(image);
  }
    
    displayMessage(message){
        let mes=document.getElementById("snipstatus");
        mes.innerHTML=message;
    }

}