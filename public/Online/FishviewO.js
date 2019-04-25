/**
 * Provide methods that use the system I/O to interact with the user.
 * This implementation uses the JavaScript window.prompt() method
 * for input (and some output) and window.alert() for (purely) output.
 */
class FishviewO {
    constructor(presenter) {
	//alert("called");
    this.presenter = presenter;
    this.topCard = null;
    this.topCardString = "";
    this.errorString = "";
        this.comPoints=0;
        this.humanPoints=0;
        this.allCardsDiv=document.getElementById("allfish");
    
        document.getElementById("fuserhand").addEventListener("click",function(){presenter.fish(event.target.title);});
  }

  displayComputerHand(handlength){
     let cpu = document.getElementById("fcpuhand");
     while(cpu.hasChildNodes()){
	   cpu.removeChild(cpu.lastChild);
      }
      let hand=[];
      for(var i=0; i<handlength; i++){
          hand.push(new Card("j","h"));
      }
      
    for(let i=0; i<hand.length; i++){
        let image=document.createElement("img");
	    image.src ="./Images/cardback.png";
	    image.class="card positionable";
        image.style="position: absolute; left: "+ ((40*i)+10 ) + "px; z-index:" + i +";";
	    cpu.appendChild(image);
    }
  }

  displayHumanHand(hand){
     let human = document.getElementById("fuserhand");
     while(human.hasChildNodes()){
	   human.removeChild(human.lastChild);
     }
     for(let i=0; i<hand.length; i++){
         
         let image=document.createElement("img");
	     image.src ="./Images/"+hand[i].toString()+".png";
	     image.title=hand[i].toString();
	     image.class="card positionable";
         image.style="position: absolute; left: "+ ((40*i)+10 ) + "px; z-index:" + i +";";
	     human.appendChild(image);
    }
  }
    
  addComCard(numCards){
      //alert("CPU");
      let cpu = document.getElementById("fcpuhand");
      let image=document.createElement("img");
	  image.src ="./Images/cardback.png";
	  image.class="card positionable";
	  image.style="position:absolute; left:"+  (-20) + "px; z-index:" + numCards +"; hieght:10px";
	  cpu.appendChild(image);
      this.moveCardIn(image,(40*(numCards-1)),-20);
    }
    
    addHumanCard(card,numCards){//Have a card move in from offscreen
        //alert("User");//alert(numCards);
        let human=document.getElementById("fuserhand");
        let image=document.createElement("img");
	    image.src ="./Images/"+card.toString()+".png";
	    image.title=card.toString();
        image.id=card.toString()+"F";
        image.class="card positionable";
	    image.style="position:absolute; left:"+(-20)+"px; z-index:" +(numCards)+"; hieght:10px";
        human.appendChild(image);
        this.moveCardIn(image,(40*(numCards-1)),-20);
    }
    
    giveHumanPoint(card){
        let p=document.getElementById("playerfours");
        let image=document.createElement("img");
	    image.src ="./Images/"+card.toString()+".png";
	    image.title=card.toString();
        image.class="card positionable";
        image.style="position: absolute; left: "+ (-30) + "px; z-index:" + i +";";
        this.humanPoints++;
        p.appendChild(image);
        this.moveCardIn(image,((40*(this.humanPoints-1))),-30);
    }
    
    giveComPoint(card){
        let p=document.getElementById("comfours");
        let image=document.createElement("img");
	   image.src ="./Images/"+card.toString()+".png";
	   image.title=card.toString();
        image.class="card positionable";
        image.style="position: absolute; left: "+ -30 + "px; z-index:" + i +";";
        this.comPoints++;
        p.appendChild(image);
        this.moveCardIn(image,((40*(this.comPoints-1) )),-30);
    }
    
    /**
      Move card across the screen to its appropriate spot
    **/
    moveCardIn(image,pos,i){//for handling card animations
        console.log("Moving a card");
        image.style.left=(i+5)+"px";
        if(i<pos){
            setTimeout(()=> {
                //console.log("timeout function");
                this.moveCardIn(image,pos,i+5);
            },15);
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
    this.allCardsDiv.addEventListener("click", this.clickBlocker, true);
    // Dim the cards to indicate that play is blocked.
    this.allCardsDiv.style.opacity = 0.5;
  }
    
  /**
   * Unblock user from playing.
   */
  unblockPlay() {
    // Remove capturing listener
    this.allCardsDiv.removeEventListener("click", this.clickBlocker, true);
    // Undim the cards to indicate that play is no longer blocked.
    this.allCardsDiv.style.opacity = 1.0;
  }
    
    eraseHands(){
        let human=document.getElementById("fuserhand");
        let computer=document.getElementById("fcpuhand");
        while(human.hasChildNodes()){
            human.removeChild(human.lastChild);
        }
        while(computer.hasChildNodes()){
	       computer.removeChild(computer.lastChild);
        }
    }
    
    displayMessage(message){
        let mes=document.getElementById("fishstatus");
        mes.innerHTML=message;
    }
    
    displayWrongCardMsg(card){
	   let mes=document.getElementById("fishstatus");
        mes.innerHTML="Illegal Play please give a "+card.getValue();
   }
    
    removeEvents(){//clone objects to remove event listeners
        //alert("removing event listeners");
        var old1 = document.getElementById("fuserhand");
        var new1 = old1.cloneNode(true);
        old1.parentNode.replaceChild(new1, old1);
    }

}