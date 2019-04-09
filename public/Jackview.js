/**
 * Provide methods that use the system I/O to interact with the user.
 * This implementation uses the JavaScript window.prompt() method
 * for input (and some output) and window.alert() for (purely) output.
 */
class Jackview {
    constructor(jpres) {
    this.jpres = jpres;
    this.topCard = null;
    this.topCardString = "";
  }

  displayComputerHand(hand){
     let cpu = document.querySelector("#dealerhand");
     while(cpu.hasChildNodes()){
	 cpu.removeChild(cpu.lastChild);
      }
  for(let i=0; i<hand.length; i++){
      let image=document.createElement("img");
      if(!hand[i].flipped){
	       image.src ="./Images/"+hand[i].toString()+".png";
	       image.title=hand[i].toString();
	       image.class="card positionable";
	       image.style="position:absolute; left:"+  ((35*(i))+10) + "px; z-index:" + i +" hieght:10px";
      }else{
	    image.src ="./Images/cardback.png";
	    image.title=hand[i].toString();
	    image.class="card positionable";
	    image.style="position:absolute; left:"+  ((35*(i))+10) + "px; z-index:" + i +" hieght:10px";
      }
	   cpu.appendChild(image);
   }
  }

  displayHumanHand(hand){
     let human = document.querySelector("#playerhand");
     while(human.hasChildNodes()){
	 human.removeChild(human.lastChild);
      }
     for(let i=0; i<hand.length; i++){
        let image=document.createElement("img");
	   image.src ="./Images/"+hand[i].toString()+".png";
	   image.title=hand[i].toString();
	   image.class="card positionable";
	   image.style="position:absolute; left:"+  ((35*(i))+10) + "px; z-index:" + i +" hieght:10px";
	   human.appendChild(image);
   }
  }
    
    addComCard(card,numCards){
        let cpu = document.getElementById("dealerhand");
       //alert("cpu");
       let image=document.createElement("img");
	   image.src ="./Images/"+card.toString()+".png";
	   image.title=card.toString()+"E";
        //image.id=card.toString()+"E";
	   image.class="card positionable";
	   image.style="position:absolute; left:"+  (-30) + "px; z-index:" + numCards +" hieght:10px";
	   cpu.appendChild(image);
        this.moveCard(image,(30*(numCards-1)),-30);
    }
    
    addHumanCard(card,numCards){//Have a card move in from offscreen
        let human=document.getElementById("playerhand");
        let image=document.createElement("img");
	       image.src ="./Images/"+card.toString()+".png";
	       image.title=card.toString()+"E";
          //image.id=card.toString()+"E";
	       image.class="card positionable";
	       image.style="position:absolute; left:"+  -35 + "px; z-index:" + i +" hieght:10px";
            human.appendChild(image);
        this.moveCard(image,(30*(numCards-1)),-30);
    }
    
    moveCard(image,pos,i){//for handling card animations
        image.style.left=(i+5)+"px";
        if(i<pos){
            setTimeout(()=> {
                //console.log("timeout function");
                this.moveCard(image,pos,i+5);
            },30);
        }
    }
    
    displayMessage(message){
        let mes=document.getElementById("jackstatus");
        mes.innerHTML=message;
    }
    
    eraseHands(){
        let human=document.getElementById("playerhand");
        let computer=document.getElementById("dealerhand");
        while(human.hasChildNodes()){
            human.removeChild(human.lastChild);
        }
        while(computer.hasChildNodes()){
	       computer.removeChild(computer.lastChild);
        }
    }

}