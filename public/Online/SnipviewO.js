/**
 * Provide methods that use the system I/O to interact with the user.
 * This implementation uses the JavaScript window.prompt() method
 * for input (and some output) and window.alert() for (purely) output.
 */
class SnipviewO {
    constructor(presenter) {
        this.presenter = presenter;
        this.topCard = null;
        this.topCardString = "";
        this.allCardsDiv=document.getElementById("allSnips");
        this.userHand=document.getElementById("suserhand");
        this.allCardsDiv=document.getElementById("allSnips");
        
         this.userHand.addEventListener("click",function(){presenter.cardSelected(event.target.title);});
  }

  displayComputerHand(handLength){
     let cpu = document.getElementById("scpuhand");
     while(cpu.hasChildNodes()){
	   cpu.removeChild(cpu.lastChild);
      }
      let hand=[];
      
      for(var i=0; i<handLength; i++){
          hand.push(new Card("h","j"));
      }
      
    for(let i=0; i<hand.length; i++){
       //alert("Player "+hand[i].toString());
       let image=document.createElement("img");
	   image.src ="./Images/cardback.png";
	   image.class="card positionable";
        image.style="position: absolute; left: "+ ((35*i)+10 ) + "px; z-index:" + i +";";
	   //image.style="left: "+  (15*i) + " px; z-index:" + i +" hieght:10px";
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
         image.style="position: absolute; left: "+ ((35*i)+10 ) + "px; z-index:" + i +";";;
	    //image.style="left: "+  (15*i) + " px; z-index:" + i +"";
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
     image.style="position: absolute; left: "+  (-30) + " px; z-index:" + 1 +"";
	 table.appendChild(image);
     this.moveCard(image, 50, -30);
  }
    
     moveCard(image,pos,i){//for handling card animations
        image.style.left=(i+5)+"px";
        if(i<pos){
            setTimeout(()=> {
                this.moveCard(image,pos,i+5);
            },30);
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
    
    displayMessage(message){
        let mes=document.getElementById("snipstatus");
        mes.innerHTML=message;
    }
    
    removeEvents(){
        //alert("removing online event listeners");
        var old1 = document.getElementById("suserhand");
        
        var new1 = old1.cloneNode(true);
        //var new_element = old_element.cloneNode(true);
        old1.parentNode.replaceChild(new1, old1);
    }

}