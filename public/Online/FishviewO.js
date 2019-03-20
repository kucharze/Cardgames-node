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
        //image.title=hand[i].toString();
        image.style="position: absolute; left: "+ ((40*i)+10 ) + "px; z-index:" + i +";";
	   //image.style="left: "+  (15*i) + " px; z-index:" + i +" hieght:10px";
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
	   //image.style="left: "+  (15*i) + " px; z-index:" + i +"";
	   human.appendChild(image);
    }
  }
    
    giveHumanPoint(card){
        //alert("Human point");
        let p=document.getElementById("playerfours");
        let image=document.createElement("img");
	       image.src ="./Images/"+card.toString()+".png";
	       image.title=card.toString();
          image.class="card positionable";
          image.style="position: absolute; left: "+ ((40*(this.humanPoints))+10 ) + "px; z-index:" + i +";";
            //image.style="left: "+  (15*i) + " px; z-index:" + i +"";
        this.humanPoints++;
        p.appendChild(image);
    }
    
    giveComPoint(card){
       // alert("Computer point");
        let p=document.getElementById("comfours");
        let image=document.createElement("img");
	       image.src ="./Images/"+card.toString()+".png";
	       image.title=card.toString();
          image.class="card positionable";
          image.style="position: absolute; left: "+ ((40*this.comPoints)+10 ) + "px; top:+" + 350 +"px; z-index:" + i +";";
        //image.style="left: "+  (15*i) + " px; z-index:" + i +"";
        this.comPoints++;
        p.appendChild(image);
    }
    
      /**
   * Block user from playing.
   */
  blockPlay() {
    // Capture and ignore all clicks
    document.getElementById("allfish").addEventListener("click", this.clickBlocker, true);
    // Dim the cards to indicate that play is blocked.
    this.allCardsDiv.style.opacity = 0.5;
  }
    
  /**
   * Unblock user from playing.
   */
  unblockPlay() {
    // Remove capturing listener
    document.getElementById("allfish").removeEventListener("click", this.clickBlocker, true);
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
    
    displayWrongCardMsg(){
	   let mes=document.getElementById("fishstatus");
        mes.innerHTML="You cannot play that card";
   }
    
    removeEvents(){//clone objects to remove event listeners
        //alert("removing event listeners");
        var old1 = document.getElementById("fuserhand");
        var new1 = old1.cloneNode(true);
        old1.parentNode.replaceChild(new1, old1);
    }

}