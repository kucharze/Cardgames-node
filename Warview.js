/**
 * Provide methods that use the system I/O to interact with the user.
 * This implementation uses the JavaScript window.prompt() method
 * for input (and some output) and window.alert() for (purely) output.
 */
class Warview {
    
    constructor(presenter) {
    this.presenter = presenter;
    this.topCardString = "";
    
    //document.getElementById("warreset").addEventListener("click", function(){presenter.resetGame();})
        
    //document.getElementById("deck").addEventListener("click", function(){presenter.cardPicked();})
    //document.getElementById("suitPicker").addEventListener("click", function() {presenter.suitPicked(event.target.id);});
    //document.getElementById("wyourdeck").addEventListener("click", function(){presenter.dealCards();});
  }

  announceComputerWinner(){
    let CPUwinner = document.getElementById("warstatus");
    CPUwinner.innerHTML="Thanks for being a good loser";
  }

  announceHumanWinner(){
    let humanwin = document.getElementById("warstatus");
    humanwin.innerHTML="Congradulations! You win!";
  }

  displayComputerCard(hand){
     let cpu = document.getElementById("mycard");
     let war=document.getElementById("mywar"); 
      
     while(cpu.hasChildNodes()){
	   cpu.removeChild(cpu.lastChild);
      }
      
      while(war.hasChildNodes()){
	       war.removeChild(war.lastChild);
      }
      
        let w=document.createElement("img");
        w.src ="./Images/cardback.png";
	    w.class="card positionable";
	    w.style="left: "+  (15) + " px; z-index:" + 1 +"";
	    war.appendChild(w);
        war.appendChild(w);
      
         let image=document.createElement("img");
         image.src ="./Images/"+hand.toString()+".png";
	       image.title=hand.toString();
	       image.class="card positionable";
	       image.style="left: "+  (15) + " px; z-index:" + 1 +"";
	       cpu.appendChild(image);
  }

  displayHumanCard(hand){
     let human = document.getElementById("yourcard");
      let war=document.getElementById("yourwar");
     while(human.hasChildNodes()){
	       human.removeChild(human.lastChild);
      }
      while(war.hasChildNodes()){
	       war.removeChild(war.lastChild);
      }
        let w=document.createElement("img");
        w.src ="./Images/cardback.png";
	    w.class="card positionable";
	    w.style="left: "+  (15) + " px; z-index:" + 1 +"";
	    war.appendChild(w);
        war.appendChild(w);
      
         let image=document.createElement("img");
         image.src ="./Images/"+hand.toString()+".png";
	       image.title=hand.toString();
	       image.class="card positionable";
	       image.style="left: "+  (15) + " px; z-index:" + 1 +"";
	       human.appendChild(image);
    }
    
    displayHumanWarCards(cardup,cardd){
        let war=document.getElementById("yourwar");
        
        while(war.hasChildNodes()){
	       war.removeChild(war.lastChild);
        }
        let image1=document.createElement("img");
        image1.src ="./Images/"+cardup.toString()+".png";
	    image1.title=cardup.toString();
	    image1.class="card positionable";
	    image1.style="left: "+  (15) + " px; z-index:" + 1 +"";
	    war.appendChild(image1);
        
        let image2=document.createElement("img");
        image2.src ="./Images/"+cardd.toString()+".png";
	    image2.title=cardd.toString();
	    image2.class="card positionable";
	    image2.style="left: "+  (15) + " px; z-index:" + 1 +"";
	    war.appendChild(image2);        
    }
    
    displayComputerWarCards(cardup, cardd){
        let war=document.getElementById("mywar");
        
        while(war.hasChildNodes()){
	       war.removeChild(war.lastChild);
        }
        let image1=document.createElement("img");
        image1.src ="./Images/"+cardup.toString()+".png";
	    image1.title=cardup.toString();
	    image1.class="card positionable";
	    image1.style="left: "+  (15) + " px; z-index:" + 1 +"";
	    war.appendChild(image1);
        
        let image2=document.createElement("img");
        image2.src ="./Images/"+cardd.toString()+".png";
	    image2.title=cardd.toString();
	    image2.class="card positionable";
	    image2.style="left: "+  (15) + " px; z-index:" + 1 +"";
	    war.appendChild(image2);
    }
    
    displayMessage(message){
        let mes=document.getElementById("warstatus");
        mes.innerHTML=message;
    }
    
    eraseHands(){
        let human=document.querySelector("#yourHand");
        let computer=document.querySelector("#myHand");
        while(human.hasChildNodes()){
            human.removeChild(human.lastChild);
        }
        while(computer.hasChildNodes()){
	       computer.removeChild(computer.lastChild);
        }
    }

}