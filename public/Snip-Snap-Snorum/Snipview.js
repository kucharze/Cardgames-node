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
    //this.errorString = "";
    
    document.getElementById("suserhand").addEventListener("click",function(){presenter.cardSelected(event.target.title);});
  }

  announceComputerWinner(){
    let CPUwinner = document.getElementById("status");
    CPUwinner.innerHTML="Thanks for being a good loser";
  }

  announceHumanWinner(){
    let humanwin = document.getElementById("status");
    humanwin.innerHTML="Congratulations! You win!";
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
	        image.title="Card Back";
	        image.class="card positionable";
            image.style="position: absolute; left: "+ ((35*i)+10) + "px; z-index:" + i +";";
        
            cpu.appendChild(image);
    }
  }

  displayHumanHand(hand){
     let human = document.getElementById("suserhand");
     while(human.hasChildNodes()){
         human.removeChild(human.lastChild);
      }
     for(let i=0; i<hand.length; i++){
        let image=document.createElement("img");
	    image.src ="./Images/"+hand[i].toString()+".png";
        image.title=hand[i].toString();
	    image.class="card positionable";
        image.style="position: absolute; left: "+ ((35*i)+10 ) + "px; z-index:" + i +";";
	    human.appendChild(image);
     }
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
          image.title="Card Back";
      }else{
          image.src ="./Images/"+card.toString()+".png";
          image.title=this.topCard.getValue()+this.topCard.getSuit();
      }
	 
	 image.id="Snippile";
	 image.class="card positionable";
	 image.style="position: absolute; left: "+  (-50) + " px; z-index:" + 1 +"";
	 table.appendChild(image);
      this.moveCard(image, 50);
  }
    
    moveCard(image,pos){//for handling card animations
        $(image).animate({left: pos},800);
    }
    
    displayMessage(message){
        let mes=document.getElementById("snipstatus");
        mes.innerHTML=message;
    }
    
    passTurn(){
        let mes=document.getElementById("snipstatus");
        mes.innerHTML=mes.innerHTML+" Your turn";
    }
    
    removeEvents(){
        //alert("removing online event listeners");
        var old1 = document.getElementById("suserhand");
        var new1 = old1.cloneNode(true);
        old1.parentNode.replaceChild(new1, old1);
    }

}