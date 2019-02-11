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
	       image.style="left: "+  (15*i) + " px; z-index:" + i +""; 
      }else{
	    image.src ="./Images/cardback.png";
	    image.title=hand[i].toString();
	    image.class="card positionable";
	    image.style="left: "+  (15*i) + " px; z-index:" + i +" hieght:10px";
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
	   image.style="left: "+  (15*i) + " px; z-index:" + i +"";
	   human.appendChild(image);
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