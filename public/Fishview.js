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
      if(hand!=null || hand.length>0){
          for(let i=0; i<hand.length; i++){
              let image=document.createElement("img");
	          image.src ="./Images/cardback.png";
              image.title="Card back";
	          image.class="card positionable";
              image.style="position: absolute; left: "+ ((40*i)) + "px; z-index:" + i +";";
	          cpu.appendChild(image);
            }
      }
  }

  displayHumanHand(hand){
     let human = document.getElementById("fuserhand");
     while(human.hasChildNodes()){
	   human.removeChild(human.lastChild);
     }
      if(hand!=null || hand.length>0){
          for(let i=0; i<hand.length; i++){
              let image=document.createElement("img");
	          image.src ="./Images/"+hand[i].toString()+".png";
	          image.title=hand[i].toString();
              image.id=hand[i].toString()+"F";
              image.class="card positionable";
              image.style="position: absolute; left: "+ ((40*i)) + "px; z-index:" + i +";";
              human.appendChild(image);
          }
      }
  }
    
    addComCard(card,numCards){
        let cpu = document.getElementById("fcpuhand");
        let image=document.createElement("img");
	    image.src ="./Images/cardback.png";
	    image.title=card.toString();
        image.id=card.toString()+"F";
	    image.class="card positionable";
	    image.style="position:absolute; left:"+  (-20) + "px; z-index:" + numCards +"; hieght:10px";
	    cpu.appendChild(image);
        this.moveCardIn(image,(40*(numCards-1)),-20);
    }
    
    addHumanCard(card,numCards){//Have a card move in from offscreen
        let human=document.getElementById("fuserhand");
        let image=document.createElement("img");
	    image.src ="./Images/"+card.toString()+".png";
	    image.title=card.toString();
        image.id=card.toString()+"F";
	    image.class="card positionable";
	    image.style="position:absolute; left:"+  (-20) + "px; z-index:" + (numCards) +"; hieght:10px";
        human.appendChild(image);
        this.moveCardIn(image,(40*(numCards-1)));
    }
    
    moveCardIn(image,pos){//for handling card animations
        //console.log("Moving a card");
        $(image).animate({left: pos},800);
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
        this.moveCardIn(image,((40*(this.humanPoints-1))));
    }
    
    giveComPoint(card){
       //alert("Computer point");
       let p=document.getElementById("comfours");
       let image=document.createElement("img");
	   image.src ="./Images/"+card.toString()+".png";
	   image.title=card.toString();
       image.class="card positionable";
       image.style="position: absolute; left: "+ -30 + "px; z-index:" + i +";";
       this.comPoints++;
       p.appendChild(image);
       this.moveCardIn(image,((40*(this.comPoints-1) )));
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
        while(p.hasChildNodes()){
	       p.removeChild(p.lastChild);
        }
        while(cp.hasChildNodes()){
	       cp.removeChild(cp.lastChild);
        }
        this.humanPoints=0;
        this.comPoints=0;
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