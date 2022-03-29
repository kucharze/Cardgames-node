/**
 * Setting up Crazy Eights human vs computer
 */
class Solpres {
    /**
     * Initialize game by creating and shuffling the deck,
     * dealing one card (other than an 8) to the discard pile,
     * and dealing 7 cards to each player.
     */
    constructor(ws) {
        this.moves=0;
        this.actionRow=null;
        this.actionPos=-1;
        this.deck = new Soldeck();
	    this.deck.shuffle();
        this.deck.shuffle();
        //this.extra=new Soldeck();//deck used for dealing out extra cards
        //this.extra.shuffle();
        //this.extra.shuffle();
	    this.solview = new Solview(this);
        this.placing=false;
        this.socket=ws;
        this.score=0;
        
        //arrays for each row of cards//commented out sections for testing purposes
        //this.row1=new Array(new Card("h","k"),new Card("h","q"),new Card("h","j"),new Card("h","10"),new Card("h","9"),new Card("h","8"),new Card("h","7"),new Card("h","6"),new Card("h","5"),new Card("h","4"),new Card("h","3"),new Card("h","2"));
        this.row1=new Array(this.deck.dealACard(), this.deck.dealACard(), this.deck.dealACard(), this.deck.dealACard());
        this.row2=new Array(this.deck.dealACard(), this.deck.dealACard(), this.deck.dealACard(), this.deck.dealACard());
        this.row3=new Array(this.deck.dealACard(), this.deck.dealACard(), this.deck.dealACard(), this.deck.dealACard());
        this.row4=new Array(this.deck.dealACard(), this.deck.dealACard(), this.deck.dealACard(), this.deck.dealACard());//,new Card("h","a") );
        this.row5=new Array(this.deck.dealACard(), this.deck.dealACard(), this.deck.dealACard(), this.deck.dealACard());
        this.row6=new Array(this.deck.dealACard(), this.deck.dealACard(), this.deck.dealACard(), this.deck.dealACard());
        
        for(var i=0; i<this.row1.length-1; i++){
            this.row1[i].flip();
        }
        for(var i=0; i<this.row2.length-1; i++){
            this.row2[i].flip();
        }
        for(var i=0; i<this.row3.length-1; i++){
            this.row3[i].flip();
        }
        for(var i=0; i<this.row4.length-1; i++){
            this.row4[i].flip();
        }
        for(var i=0; i<this.row5.length-1; i++){
            this.row5[i].flip();
        }
        for(var i=0; i<this.row6.length-1; i++){
            this.row6[i].flip();
        }
        this.decksadded=0;
    }

//Finds a card based on info passed in and then determines how to move cards
 cardSelected(cardPos,row){
     //let c=null;
     if(cardPos==""){//A face down card was clicked on
         this.solview.displayMessage("That card is currently not flipped up");
         return;
     }
     
     let card=null;
     //alert("cardpos="+cardPos);
     if(cardPos=="empty"){
         card = new Card("s","k");
     }
     else{
         card=this.find(cardPos,row);
     }
     //let card=this.find(cardPos,row);
     if(card==null){//Null card error
         this.solview.displayMessage("Error cannot find chosen card")
         return;
     }
     else{
         if(!this.placing){
             let value=0;
             let j=0;
             //Find pos of card to make changes to selected row
             if(row=="row1"){
                 for(var i =cardPos; i<this.row1.length; i++){
                     j=++i;
                     i--;
                     if(i==this.row1.length-1){
                         break;
                     }
                     if(this.row1[i].getSValue() != +this.row1[j].getSValue() + +1){
                         alert("Move fail");
                         this.solview.displayMessage("That card cannot be moved");
                         return;
                     }
                 }
             }
             else if(row=="row2"){
                 for(var i =cardPos; i<this.row2.length; i++){
                     j=++i;
                     i--;
                     if(i==this.row2.length-1){
                         break;
                     }
                     if(this.row2[i].getSValue() != +this.row2[j].getSValue() + +1){
                         alert("Move fail");
                         this.solview.displayMessage("That card cannot be moved");
                         return;
                     }
                 }
             }
             else if(row=="row3"){
                 for(var i =cardPos; i<this.row3.length; i++){
                     j=++i;
                     i--;
                     if(i==this.row3.length-1){
                         break;
                     }
                     if(this.row3[i].getSValue() != +this.row3[j].getSValue() + +1){
                         alert("Move fail");
                         this.solview.displayMessage("That card cannot be moved");
                         return;
                     }
                 }
             }
             else if(row=="row4"){
                 for(var i =cardPos; i<this.row4.length; i++){
                     j=++i;
                     i--;
                     if(i==this.row4.length-1){
                         break;
                     }
                     if(this.row4[i].getSValue() != +this.row4[j].getSValue() + +1){
                         alert("Move fail");
                         this.solview.displayMessage("That card cannot be moved");
                         return;
                     }
                 }
             }
             else if(row=="row5"){
                 for(var i =cardPos; i<this.row5.length; i++){
                     j=++i;
                     i--;
                     if(i==this.row5.length-1){
                         break;
                     }
                     if(this.row5[i].getSValue() != +this.row5[j].getSValue() + +1){
                         alert("Move fail");
                         this.solview.displayMessage("That card cannot be moved");
                         return;
                     }
                 }
             }
             else if(row=="row6"){
                 for(var i =cardPos; i<this.row6.length; i++){
                     j=++i;
                     i--;
                     if(i==this.row6.length-1){
                         break;
                     }
                     if(this.row6[i].getSValue() != +this.row6[j].getSValue() + +1){
                         alert("Move fail");
                         this.solview.displayMessage("That card cannot be moved");
                         return;
                     }
                 }
             }
             
             this.actionRow=row
             this.placing=true;
             this.actionPos=cardPos;
             this.solview.displayMessage("Select row to place cards at");
             
            return;
        }else{
            /*
             * Section for determining if the move is legal
             * 
            */
            //Boolean to determine if we are making a legal move currently false for testing
            let movable=false;
            let value=card.getSValue();
            
            if(cardPos=="empty"){
                movable=true;
            }
            else{
                 //Run checks to make sure the move that we are making is legal
            if(this.actionRow=="row1"){
                    if(this.row1[this.actionPos].getSValue() == (+card.getSValue() - +1)){movable=true;}else{movable=false;}
            }
            else if(this.actionRow=="row2"){
                    if(this.row2[this.actionPos].getSValue() == (+card.getSValue() - +1)){movable=true;}else{movable=false;}
            }
            else if(this.actionRow=="row3"){
                    if(this.row3[this.actionPos].getSValue() == (+card.getSValue() - +1)){movable=true;}else{movable=false;}
            }
            else if(this.actionRow=="row4"){
                    if(this.row4[this.actionPos].getSValue() == (+card.getSValue() - +1)){movable=true;}else{movable=false;}
            }
            else if(this.actionRow=="row5"){
                    if(this.row5[this.actionPos].getSValue() == (+card.getSValue() - +1)){movable=true;}else{movable=false;}
            }
            else if(this.actionRow=="row6"){
                    if(this.row6[this.actionPos].getSValue() == (+card.getSValue() - +1) ){movable=true;}else{movable=false;}
            } 
            }
            
            if(!movable){//if the move that we are making is not legal
                this.solview.displayMessage("Illeagal move select cards to move again");
                this.actionRow=null;
                this.actionPos=-1;
                this.placing=false;
                return;
            }
            
            let mrow=new Array();
                
            if(this.actionRow=="row1"){
                for(var i=this.actionPos; i<this.row1.length; i++){
                    mrow.push(this.row1[i]);
                    //this.solview.addCard(this.row1[i],row);
                    //this.solview.removeCard(this.row1[i],this.actionRow);
                }
                this.row1.splice(this.actionPos);
                  this.solview.displayRow(this.row1, 1);
            }else if(this.actionRow=="row2"){
                for(var i=this.actionPos; i<this.row2.length; i++){
                    mrow.push(this.row2[i]);
                    //this.solview.removeCard(this.row2[i],this.actionRow);
                }
                this.row2.splice(this.actionPos);
                this.solview.displayRow(this.row2, 2);
            }else if(this.actionRow=="row3"){
                for(var i=this.actionPos; i<this.row3.length; i++){
                    mrow.push(this.row3[i]);
                    //this.solview.removeCard(this.row3[i],this.actionRow);
                }
                this.row3.splice(this.actionPos);
                this.solview.displayRow(this.row3, 3);
            }else if(this.actionRow=="row4"){
                for(var i=this.actionPos; i<this.row4.length; i++){
                    mrow.push(this.row4[i]);
                    //this.solview.removeCard(this.row4[i],this.actionRow);
                }
                this.row4.splice(this.actionPos);
                this.solview.displayRow(this.row4, 4);
            }else if(this.actionRow=="row5"){
                for(var i=this.actionPos; i<this.row5.length; i++){
                    mrow.push(this.row5[i]);
                   // this.solview.removeCard(this.row5[i],this.actionRow);
                }
                this.row5.splice(this.actionPos);
                this.solview.displayRow(this.row5, 5);
            }else if(this.actionRow=="row6"){
                for(var i=this.actionPos; i<this.row6.length; i++){
                    mrow.push(this.row6[i]);
                    //this.solview.removeCard(this.row6[i],this.actionRow);
                }
                this.row6.splice(this.actionPos);
                this.solview.displayRow(this.row6, 6);
            }
            
                if(row=="row1"){
                    for(var i=0; i<mrow.length; i++){
                        this.row1.push(mrow[i]);
                        this.solview.addCard(mrow[i],row);
                    }
                }
                if(row=="row2"){
                    for(var i=0; i<mrow.length; i++){
                        this.row2.push(mrow[i]);
                        this.solview.addCard(mrow[i],row);
                    }
                }
                if(row=="row3"){
                    for(var i=0; i<mrow.length; i++){
                        this.row3.push(mrow[i]);
                        this.solview.addCard(mrow[i],row);
                    }
                }
                if(row=="row4"){
                    for(var i=0; i<mrow.length; i++){
                        this.row4.push(mrow[i]);
                        this.solview.addCard(mrow[i],row);
                    }
                }
                if(row=="row5"){
                    for(var i=0; i<mrow.length; i++){
                        this.row5.push(mrow[i]);
                        this.solview.addCard(mrow[i],row);
                    }
                }
                if(row=="row6"){
                    for(var i=0; i<mrow.length; i++){
                        this.row6.push(mrow[i]);
                        this.solview.addCard(mrow[i],row);
                    }
                }
            
                //Delay further actions until animation has finished.
            setTimeout(()=>{
                this.checkFlips();
                this.actionRow=null;
                this.placing=false;
                if(this.row1.length>=13){this.removeCards(this.row1);}
                if(this.row2.length>=13){this.removeCards(this.row2);}
                if(this.row3.length>=13){this.removeCards(this.row3);}
                if(this.row4.length>=13){this.removeCards(this.row4);}
                if(this.row5.length>=13){this.removeCards(this.row5);}
                if(this.row6.length>=13){this.removeCards(this.row6);}
            
                if(this.checkWin()){
                    this.solview.displayMessage("Congratulations you cleared all the cards!!!");
                }
                else{
                    this.solview.displayMessage("Select cards to have moved");
            
                    this.solview.displayRow(this.row1, 1);
                    this.solview.displayRow(this.row2, 2);
                    this.solview.displayRow(this.row3, 3);
                    this.solview.displayRow(this.row4, 4);
                    this.solview.displayRow(this.row5, 5);
                    this.solview.displayRow(this.row6, 6); 
                }
            },1800);

            
        }
     }
     
    return;
 }  
    
    recordResult(){
        alert(this.score);
        let obj={};
        obj.action="Spider Solitare";
        obj.score=this.score;
        this.socket.send(JSON.stringify(obj));
    }
    
    dealNewCards(){
        let card1=this.deck.dealACard();
        let card2=this.deck.dealACard();
        let card3=this.deck.dealACard();
        let card4=this.deck.dealACard();
        let card5=this.deck.dealACard();
        let card6=this.deck.dealACard();
        
        this.row1.push(card1);
        this.row2.push(card2);
        this.row3.push(card3);
        this.row4.push(card4);
        this.row5.push(card5);
        this.row6.push(card6);
        
        this.solview.addCard(card1,"row1");
        this.solview.addCard(card2,"row2");
        this.solview.addCard(card3,"row3");
        this.solview.addCard(card4,"row4");
        this.solview.addCard(card5,"row5");
        this.solview.addCard(card6,"row6");
        
        setTimeout(()=>{
            this.solview.displayRow(this.row1, 1);
            this.solview.displayRow(this.row2, 2);
            this.solview.displayRow(this.row3, 3);
            this.solview.displayRow(this.row4, 4);
            this.solview.displayRow(this.row5, 5);
            this.solview.displayRow(this.row6, 6);
        },1500);
        
        this.solview.eraseDeck();
        this.decksadded++;
    }
    
    find(cardPos,rowNum){
        var r=null;
        if(rowNum == "row1"){
            r=this.row1;
        }
        else if(rowNum == "row2"){
            r=this.row2;
        }
        else if(rowNum=="row3"){
            r=this.row3;
        }
        else if(rowNum=="row4"){
            r=this.row4;
        }
        else if(rowNum=="row5"){
            r=this.row5;
        }
        else if(rowNum=="row6"){
            r=this.row6;
        }
        
        return r[cardPos];
        return null;
    }
    
    removeCards(row){
        //alert("checking for cards to remove for the following row" +row);
        let c1=-1;
        var times=0;
        var pos=-1;
        for(var i=0; i<row.length; i++){
            if(row[i].flipped){
                continue;
            }
            if(row[i].getSValue()==13){
                c1 = 12;
                pos=i;
                let rem=true;
                i++;
                while(i<row.length && rem){
                    //alert("c1= "+c1);
                    //c1--;
                    //alert("current card"+row[i].getValue());
                    if(+row[i].getSValue() == +c1){
                        //alert("found the next card");
                        c1--;
                        i++
                    }
                    else{
                        rem=false;
                        break;
                    }
                    if(c1 == 0){
                        this.score++;
                        row.splice(pos, 13);
                        let c=document.getElementById("Vicdecks");
                        let image=document.createElement("img");
                        image.src ="./Images/kh.png";
	                    image.title="";
                        image.id="empty";
	                    image.class="card positionable";
                        image.style="z-index:" + i +";";
                        c.appendChild(image);
                        return;
                    }
                }
            }
        }
        
    }
    
    checkWin(){
        let win=true;
        if(this.row1.length>0){
            win=false;
        }
        if(this.row2.length>0){
            win=false;
        }
        if(this.row3.length>0){
            win=false;
        }
        if(this.row4.length>0){
            win=false;
        }
        if(this.row5.length>0){
            win=false;
        }
        if(this.row6.length>0){
            win=false;
        }
        
        return win;
    }
    
    checkFlips(){
        if(this.row1.length>0){
            if(this.row1[this.row1.length-1].flipped){
                this.row1[this.row1.length-1].flip();
            }
        }
        if(this.row2.length>0){
            if(this.row2[this.row2.length-1].flipped){
                this.row2[this.row2.length-1].flip();
            }
        }
        if(this.row3.length>0){
            if(this.row3[this.row3.length-1].flipped){
                this.row3[this.row3.length-1].flip();
            }
        }
        if(this.row4.length>0){
            if(this.row4[this.row4.length-1].flipped){
                this.row4[this.row4.length-1].flip();
            }
        }
        if(this.row5.length>0){
            if(this.row5[this.row5.length-1].flipped){
                this.row5[this.row5.length-1].flip();
            }
        }
        if(this.row6.length>0){
            if(this.row6[this.row6.length-1].flipped){
                this.row6[this.row6.length-1].flip();
            }
        }
        
    }

play(){//Set up the solitare game
     this.solview.displayRow(this.row1, 1);
     this.solview.displayRow(this.row2, 2);
     this.solview.displayRow(this.row3, 3);
     this.solview.displayRow(this.row4, 4);
     this.solview.displayRow(this.row5, 5);
     this.solview.displayRow(this.row6, 6);
     return;
 }
    
    resetGame(){//Resets the game with a new deck and players
        this.solview.eraseRows();
        this.solview.displayMessage("Welcome to Spider Solitare");
        this.deck=new Soldeck();
        this.extra=new Soldeck();
        this.moves=0;
        this.actionRow=null;
        this.actionPos=0;
        
	    this.deck.shuffle();
	    this.deck.shuffle();
        this.extra.shuffle();
        this.extra.shuffle();
        
        //arrays for each row of cards
        this.row1=new Array(this.deck.dealACard(), this.deck.dealACard(), this.deck.dealACard(), this.deck.dealACard());
        this.row2=new Array(this.deck.dealACard(), this.deck.dealACard(), this.deck.dealACard(), this.deck.dealACard());
        this.row3=new Array(this.deck.dealACard(), this.deck.dealACard(), this.deck.dealACard(), this.deck.dealACard());
        this.row4=new Array(this.deck.dealACard(), this.deck.dealACard(), this.deck.dealACard(), this.deck.dealACard());
        this.row5=new Array(this.deck.dealACard(), this.deck.dealACard(), this.deck.dealACard(), this.deck.dealACard());
        this.row6=new Array(this.deck.dealACard(), this.deck.dealACard(), this.deck.dealACard(), this.deck.dealACard());
        
        for(var i=0; i<this.row1.length-1; i++){
            this.row1[i].flip();
        }
        for(var i=0; i<this.row2.length-1; i++){
            this.row2[i].flip();
        }
        for(var i=0; i<this.row3.length-1; i++){
            this.row3[i].flip();
        }
        for(var i=0; i<this.row4.length-1; i++){
            this.row4[i].flip();
        }
       for(var i=0; i<this.row5.length-1; i++){
            this.row5[i].flip();
        }
        for(var i=0; i<this.row6.length-1; i++){
            this.row6[i].flip();
        }
        
        this.solview.displayRow(this.row1, 1);
        this.solview.displayRow(this.row2, 2);
        this.solview.displayRow(this.row3, 3);
        this.solview.displayRow(this.row4, 4);
        this.solview.displayRow(this.row5, 5);
        this.solview.displayRow(this.row6, 6);
        this.solview.addDecks(this.decksadded);
        this.decksadded=0;
        
        return;
    }

}