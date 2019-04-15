/**
 * Provide methods that use the system I/O to interact with the user.
 * This implementation uses the JavaScript window.prompt() method
 * for input (and some output) and window.alert() for (purely) output.
 */
class Solview {
    
    constructor(presenter) {
        this.presenter = presenter;
        this.topCard = null;
        this.topCardString = "";
        this.errorString = "";
    
        document.getElementById("soldecks").addEventListener("click", function(){ presenter.dealNewCards();});
        
        document.getElementById("row1").addEventListener("click", function(){ presenter.cardSelected(event.target.id,this.id);});
        document.getElementById("row2").addEventListener("click", function(){ presenter.cardSelected(event.target.id,this.id);});
        document.getElementById("row3").addEventListener("click", function(){ presenter.cardSelected(event.target.id,this.id);});
        document.getElementById("row4").addEventListener("click", function(){
            alert(event.target.class);
            presenter.cardSelected(event.target.id,this.id);});
        document.getElementById("row5").addEventListener("click", function(){ presenter.cardSelected(event.target.id,this.id);});
        document.getElementById("row6").addEventListener("click", function(){ presenter.cardSelected(event.target.id,this.id);});
        
  }

  announceHumanWinner(){
    let humanwin = document.getElementById("announcer");
    humanwin.textContent="Congradulations! You win!";
    humanwin.style="display: block";
  }
    
    displayRow(row, num){
        let card=document.getElementById("row"+num);
        
        while(card.hasChildNodes()){
            card.removeChild(card.lastChild);
        }
        
        if(row[0]==null){
            //alert("row is null");
            let image=document.createElement("img");
                image.src ="./Images/Empty.PNG";
	            image.title="Empty row";
                image.id="empty";
	            image.class="card positionable";
                image.style="position: absolute; top: "+ (30*i) + "px; z-index:" + i +";";
                card.appendChild(image);
        }
        for(var i=0; i<row.length; i++){
            if(!row[i].flipped){
                let image=document.createElement("img");
                image.src ="./Images/"+row[i].toString()+".png";
	            image.title=row[i].toString();
                image.id=(i);
	            image.class=row[i].toString()+"S";
                image.style="position: absolute; top: "+ (30*i) + "px; z-index:" + i +";";
                card.appendChild(image);
            }else{
                let image=document.createElement("img");
                image.src ="./Images/cardback.png";
	            image.title=row[i].toString();
                image.id=i;
	            image.class="card positionable";
                image.style="position: absolute; top: "+ (30*i) + "px; z-index:" + i +";";
                card.appendChild(image);
            }
        }
    }
    
    eraseDeck(){
        let decks=document.getElementById("soldecks");
        decks.removeChild(decks.lastChild);
    }
    
    addDecks(decks){
        let row=document.getElementById("soldecks");
        while(decks>0){
            let image=document.createElement("img");
            image.src ="./Images/cardback.png";
	        image.class="card positionable";
            image.style="left: "+ (15) + " px; z-index:" + 1 +"";
            row.appendChild(image);
            decks--;
        }
    }
    
    addCard(card,row){
            let r=document.getElementById(row);
        //for(var i=0; i<cards.length; i++){
            let image=document.createElement("img");
            image.src ="./Images/"+card.toString()+".png";
	        image.title=card.toString();
            //image.id=(i);
	        image.class=card.toString()+"S";
            image.style="position: absolute; top: "+(-20)+"px; z-index:" + r.childElementCount +";";
            r.appendChild(image);
            this.moveCardDown(image,(30*(r.childElementCount-1)), -20);
        //}
    }
    
    
    moveCardDown(image,pos,i){//for handling card animations
        console.log("Moving a card down");
        image.style.top=(i+5)+"px";
        if(i<pos){
            setTimeout(()=> {
                this.moveCardDown(image,pos,i+5);
            },20);
        }
    }

    
    eraseRows(){
        let row1=document.getElementById("row1");
        let row2=document.getElementById("row2");
        let row3=document.getElementById("row3");
        let row4=document.getElementById("row4");
        let row5=document.getElementById("row5");
        let vic=document.getElementById("Vicdecks");
        while(row1.hasChildNodes()){
            row1.removeChild(row1.lastChild);
        }
        while(row2.hasChildNodes()){
	       row2.removeChild(row2.lastChild);
        }
        while(row3.hasChildNodes()){
	       row3.removeChild(row3.lastChild);
        }
        while(row4.hasChildNodes()){
	       row4.removeChild(row4.lastChild);
        }
        while(row5.hasChildNodes()){
	       row5.removeChild(row5.lastChild);
        }
        while(vic.hasChildNodes()){
            vic.removeChild(vic.lastChild);
        }
    }
    
    displayMessage(message){
        let mes=document.getElementById("Solstatus");
        mes.innerHTML=message;
    }

   displayWrongCardMsg(cardstring){
	   alert("That play is invalid try again");
   }

}
