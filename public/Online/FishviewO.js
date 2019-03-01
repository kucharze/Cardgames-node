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
        image.title=hand[i].toString();
	   image.style="left: "+  (15*i) + " px; z-index:" + i +" hieght:10px";
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
	   image.style="left: "+  (15*i) + " px; z-index:" + i +"";
	   human.appendChild(image);
    }
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
	   alert("You cannot play that card");
   }
    
    removeEvents(){//clone objects to remove event listeners
        //alert("removing event listeners");
        var old1 = document.getElementById("fuserhand");
        var new1 = old1.cloneNode(true);
        old1.parentNode.replaceChild(new1, old1);
    }

}