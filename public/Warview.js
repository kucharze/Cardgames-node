/**
 * Provide methods that use the system I/O to interact with the user.
 * This implementation uses the JavaScript window.prompt() method
 * for input (and some output) and window.alert() for (purely) output.
 */
class Warview {
    
    constructor(presenter) {
        this.presenter = presenter;
        this.topCardString = "";
    }

  announceComputerWinner(){
    let CPUwinner = document.getElementById("warstatus");
    CPUwinner.innerHTML="Thanks for being a good loser";
  }

  announceHumanWinner(){
    let humanwin = document.getElementById("warstatus");
    humanwin.innerHTML="Congradulations! You win!";
  }
    
    disablePlay(){
        //alert("Disabling play");
        let button=document.getElementById("warplay");
        button.disabled=true;
    }
    
    enablePlay(){
        //alert("Enabling play");
        let button=document.getElementById("warplay");
        button.disabled=false;
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
        if(cardd==null || cardup==null){
            let image1=document.createElement("img");
            image1.src ="./Images/cardback.png";
	       image1.title=cardup.toString();
	       image1.class="card positionable";
	       image1.style="left: "+  (15) + " px; z-index:" + 1 +"";
	       war.appendChild(image1);
            return;
        }
        
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
        if(cardd==null || cardup==null){
            let image1=document.createElement("img");
            image1.src ="./Images/cardback.png";
	       image1.title=cardup.toString();
	       image1.class="card positionable";
	       image1.style="left: "+  (15) + " px; z-index:" + 1 +"";
	       war.appendChild(image1);
            return;
        }
        
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
       // <div id="mywar"><img src="Images/cardback.png" alt="Computerwarcard"></div>
    //    <div id="mycard"><img src="Images/cardback.png" alt="playerdeck"></div>
    //    <div id="yourcard"><img src="Images/cardback.png" alt="playerdeck"></div>
    //    <div id="yourwar"><img src="Images/cardback.png" alt="playerwarcard"></div>
        
        let comwar=document.getElementById("mywar");
        let comcard=document.getElementById("mycard");
        let usercard=document.getElementById("yourcard");
        let userwar=document.getElementById("yourwar");
        
        while(comwar.hasChildNodes()){
            comwar.removeChild(comwar.lastChild);
        }
        while(comcard.hasChildNodes()){
	       comcard.removeChild(comcard.lastChild);
        }
        while(usercard.hasChildNodes()){
	       usercard.removeChild(usercard.lastChild);
        }
        while(usercard.hasChildNodes()){
	       usercard.removeChild(usercard.lastChild);
        }
            let image1=document.createElement("img");
            image1.src ="./Images/cardback.png";
	        image1.class="card positionable";
	        //image1.style="z-index:" + 1 +"";
	        comcard.appendChild(image1);
            comwar.appendChild(image1);
            usercard.appendChild(image1);
            userwar.appendChild(image1);
        
        return;
    }

}