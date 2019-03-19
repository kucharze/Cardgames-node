/**
 * Provide methods that use the system I/O to interact with the user.
 * This implementation uses the JavaScript window.prompt() method
 * for input (and some output) and window.alert() for (purely) output.
 */
class Fishview {
    constructor(presenter) {
        this.presenter = presenter;
        this.topCard = null;
        this.topCardString = "";
        this.errorString = "";
        this.humanPoints=0;
        this.comPoints=0;
        document.getElementById("fuserhand").addEventListener("click", function(){ presenter.fish(event.target.title);});
  }

  displayComputerHand(hand){
     let cpu = document.getElementById("fcpuhand");
     while(cpu.hasChildNodes()){
	   cpu.removeChild(cpu.lastChild);
      }
      if(hand!=null){
          for(let i=0; i<hand.length; i++){
        let image=document.createElement("img");
	    image.src ="./Images/cardback.png";
        image.title=hand[i].toString();
	    image.class="card positionable";
        image.style="position: absolute; left: "+ ((40*i)+10 ) + "px; z-index:" + i +";";
	    //image.style="left: "+  (15*i) + " px; z-index:" + i +" hieght:10px";
	    cpu.appendChild(image);
    }
      }
  }

  displayHumanHand(hand){
     let human = document.getElementById("fuserhand");
     while(human.hasChildNodes()){
	   human.removeChild(human.lastChild);
     }
      
      if(hand!=null){
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
  }
    
    giveHumanPoint(card){
        alert("Human point");
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
        alert("Computer point");
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
    
    eraseHands(){
        let human=document.getElementById("fuserhand");
        let computer=document.getElementById("fcpuhand");
        let p=document.getElementById("playerfours");
        let cp=document.getElementById("comfours");
        while(human.hasChildNodes()){
            human.removeChild(human.lastChild);
        }
        while(computer.hasChildNodes()){
	       computer.removeChild(computer.lastChild);
        }
        while(cp.hasChildNodes()){
	       cp.removeChild(cp.lastChild);
        }
        while(cp.hasChildNodes()){
	       cp.removeChild(cp.lastChild);
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