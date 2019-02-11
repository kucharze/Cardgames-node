/**
 * Provide methods that use the system I/O to interact with the user.
 * This implementation uses the JavaScript window.prompt() method
 * for input (and some output) and window.alert() for (purely) output.
 */
class View {
    constructor(presenter) {
    this.presenter = presenter;
    this.topCard = null;
    this.topCardString = "";
    //this.errorString = "";
        
    document.getElementById("deck").addEventListener("click", function(){presenter.cardPicked();})
    document.getElementById("suitPicker").addEventListener("click", function() {presenter.suitPicked(event.target.id);});
    document.getElementById("yourHand").addEventListener("click",function(){presenter.cardSelected(event.target.title);});
  }

  announceComputerWinner(){
    let CPUwinner = document.getElementById("status");
    CPUwinner.innerHTML="Thanks for being a good loser";
    //CPUwinner.style="display: block";
  }

  announceHumanWinner(){
    let humanwin = document.getElementById("status");
    humanwin.innerHTML="Congradulations! You win!";
    //humanwin.style="display: block";
  }

  displayComputerHand(hand){
     let cpu = document.querySelector("#myHand");
     while(cpu.hasChildNodes()){
	 cpu.removeChild(cpu.lastChild);
      }
  for(let i=0; i<hand.length; i++){
      let image=document.createElement("img");
	image.src ="./Images/cardback.png";
	image.title=hand[i].toString();
	image.class="card positionable";
	image.style="left: "+  (15*i) + " px; z-index:" + i +" hieght:10px";
	cpu.appendChild(image);
   }
  }

  displayHumanHand(hand){
     let human = document.querySelector("#yourHand");
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
        let human=document.querySelector("#yourHand");
        let computer=document.querySelector("#myHand");
        while(human.hasChildNodes()){
            human.removeChild(human.lastChild);
        }
        while(computer.hasChildNodes()){
	       computer.removeChild(computer.lastChild);
        }
    }

  //display the top card of the pile
  displayPileTopCard(card){
	 let table=document.querySelector("#table");
	 table.removeChild(document.getElementById("pile"));
	 let pile = document.getElementById("pile")
     this.topCard=card;
	 let image=document.createElement("img");
	 image.src ="./Images/"+card.toString()+".png";
	 image.id="pile";
	 image.title=this.topCard.getValue()+this.topCard.getSuit();
	 image.class="card positionable";
	 image.style="left: "+  (15*2) + " px; z-index:" + 2 +"";
	 table.appendChild(image);
  }

//makes the suit picker vissible
  displaySuitPicker(){
     document.getElementById("suitPicker").style= " display: block";
   }

   displayWrongCardMsg(cardstring){
       let message=document.getElementById("status");
       message.innerHTML="Can't play " +cardstring+", try again";
   }

  //makes the suit picker invisible again
   undisplaySuitPicker(){
     document.getElementById("suitPicker").style= " display: none";
   }
    
    displaySuit(suitstring){
        let suit=document.getElementById("status");
        if(suitstring=="h"){
            suit.innerHTML="The suit is now Hearts";
        }
        if(suitstring=="d"){
            suit.innerHTML="The suit is now Diamonds";
        }
        if(suitstring=="c"){
            suit.innerHTML="The suit is now Clubs";
        }
        if(suitstring=="s"){
            suit.innerHTML="The suit is now Spades";
        }
        
        //suit.innerHTML="The suit is now " +suitstring;
    }

}