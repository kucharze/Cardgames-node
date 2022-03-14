///*
if (typeof Uploader === "undefined") {
    Card = require('./Uploader');
  }
  //*/
class Uploader{

    constructor(){
        //this.s="hello";
    }

    jackUpload(message, ws, webSockets){
        let index=webSockets.indexOf(ws);
        if((webSockets[index].username=="") || (webSockets[index].username==null)){
            console.log("Not logged in. Cannot record result");
            let obj={};
            obj.action="Blackjack";
            obj.message="You are not logged in, you cannot record a result to the leaderboard";
            ws.send(JSON.stringify(obj));
            return;
        }
        else{
            var query={screenname: webSockets[index].username};
        }
        
        database.collection("Blackjack record").find(query).toArray(function(err, result) {
            if (err) throw err;
            if(result.length==0){
                console.log("No entry found");
                query={screenname: webSockets[index].username, wins:0, losses:0};
                database.collection("Blackjack record").insertOne(query, function(err, res) {
                    if (err) throw err;
                    console.log("1 Blackjack record document inserted");
                });
                
            }
            var query={screenname: webSockets[index].username};
            database.collection("Blackjack record").find(query).toArray(function(err, result) {
                if (err) throw err;
            
                if(message.result=="win"){//win
                    var newvalue = {$set: {screenname: webSockets[index].username, wins:result[0].wins+1, losses:result[0].losses}};
                }
                else if(message.result=="loss"){//loss
                    var newvalue = {$set: {screenname: webSockets[index].username, wins:result[0].wins, losses:result[0].losses+1}};
                }
            
                database.collection("Blackjack record").updateOne(query, newvalue, function(err, res) {
                    if (err) throw err;
                    console.log("1 Blackjack record document updated");
                });   
                console.log(result);
            });
            
            console.log(result);
        });
    }

    matchUpload(message, ws, webSockets){
        let index=webSockets.indexOf(ws);
        if((webSockets[index].username=="") || (webSockets[index].username==null)){
            console.log("Not logged in. Cannot record result");
            let obj={};
            obj.action="Matching";
            obj.message="You are not logged in, you cannot record a result to the leaderboard";
            ws.send(JSON.stringify(obj));
            return;
        }
        else{
            var query={screenname: webSockets[index].username};
        }
        
        database.collection("Match moves").find(query).toArray(function(err, result) {
            if (err) throw err;
            if(result.length>0){
                console.log("Entry already exists");
                /////////
                if(result[0].moves>message.moves){
                var newvalue = {$set: {screenname: webSockets[index].username, moves: message.moves}};
                    database.collection("Match moves").updateOne(query, newvalue, function(err, res) {
                        if (err) throw err;
                        console.log("1 Match moves document updated");
                    }); 
                }  
            }
            else{
                query={screenname: webSockets[index].username, moves: message.moves};
                database.collection("Match moves").insertOne(query, function(err, res) {
                    if (err) throw err;
                    console.log("1 Match moves document inserted");
                });
            }
            console.log(result);
        });
    }

    warUpload(message, ws, webSockets){
        let index=webSockets.indexOf(ws);
        if((webSockets[index].username=="") || (webSockets[index].username==null)){
            console.log("Not logged in. Cannot record result");
            let obj={};
            obj.action="War";
            obj.message="You are not logged in, you cannot record a result to the leaderboard";
            ws.send(JSON.stringify(obj));
            return;
        }
        else{
            var query={screenname: webSockets[index].username};
        }
        
        database.collection("War record").find(query).toArray(function(err, result) {
            if (err) throw err;
            if(result.length>0){
                console.log("Entry already exists");
                //////////////
                    var newvalue = {$set: {screenname: webSockets[index].username, wins: message.wins + result[0].wins, losses: message.losses + result[0].losses} };
                    database.collection("War record").updateOne(query, newvalue, function(err, res) {
                        if (err) throw err;
                        console.log("1 War wins document updated");
                    });
            }
            else{
                query={screenname: webSockets[index].username, wins: message.wins, losses: message.losses};
                database.collection("War record").insertOne(query, function(err, res) {
                    if (err) throw err;
                    console.log("1 War wins document inserted");
                });
            }
            console.log(result);
        });
    }

    spiderUpload(message, ws, webSockets){
        let index=webSockets.indexOf(ws);
        if((webSockets[index].username=="") || (webSockets[index].username==null)){
            console.log("Not logged in. Cannot record result");
            let obj={};
            obj.action="SpiderSolitare";
            obj.message="You are not logged in, you cannot record a result to the leaderboard";
            ws.send(JSON.stringify(obj));
            return;
        }
        else{
            var query={screenname: webSockets[index].username};
        }
        //spider//////////
        console.log(message.score);
        database.collection("Solitare score").find(query).toArray(function(err, result) {
            if (err) throw err;
            if(result.length>0){
                console.log("Entry already exists Solitare");
                if(result[0].score < message.score){
                    var newvalues = {$set: {screenname: webSockets[index].username, score: message.score}};
                    database.collection("Solitare score").updateOne(query, newvalues, function(err, res) {
                        if (err) throw err;
                        console.log("1 Solitare score document updated");
                    });
                }
            }
            else{
                query={screenname: webSockets[index].username, score: message.score};
                database.collection("Solitare score").insertOne(query, function(err, res) {
                    if (err) throw err;
                    console.log("1 Solitare score document inserted");
                });
            }
            console.log(result);
        });
    }

    eightRecord(message, ws){
        let index=webSockets.indexOf(ws);
        if((webSockets[index].username=="") || (webSockets[index].username==null)){
            console.log("Not logged in. Cannot record result");
            let obj={};
            obj.action="Crazy Eights";
            obj.message="You are not logged in, you cannot record a result to the leaderboard";
            ws.send(JSON.stringify(obj));
            return;
        }
        else{
            var query={screenname: webSockets[index].username};
        }
        
        database.collection("Crazy Eights moves").find(query).toArray(function(err, result) {
            if (err) throw err;
            if(result.length>0){
                console.log("Entry already exists");
                /////////
                if(result[0].moves > message.moves){
                    var newvalues = { $set: {screenname: webSockets[index].username, moves: message.moves } };
                    database.collection("Crazy Eights moves").updateOne(query, newvalues, function(err, res) {
                        if (err) throw err;
                        console.log("1 Crazy Eights moves document updated");
                    });
                }
            }
            else{
                query={screenname: webSockets[index].username, moves: message.moves};
                database.collection("Crazy Eights moves").insertOne(query, function(err, res) {
                    if (err) throw err;
                    console.log("1 Crazy Eights moves document inserted");
                });
            }
            console.log(result);
        });
    }

    
    snipRecord(message, ws){
        let index=webSockets.indexOf(ws);
        if((webSockets[index].username=="") || (webSockets[index].username==null)){
            console.log("Not logged in. Cannot record result");
            let obj={};
            obj.action="Snip Snap Snorum";
            obj.message="You are not logged in, you cannot record a result to the leaderboard";
            ws.send(JSON.stringify(obj));
            return;
        }
        else{
            var query={screenname: webSockets[index].username};
        }
        
        database.collection("Snip Snap Snorum times").find(query).toArray(function(err, result) {
            if (err) throw err;
            if(result.length>0){
                console.log("Entry already exists");
                if((result[0].mins > message.mins) || ((result[0].mins == message.mins) && (result[0].secs > message.secs))){
                    console.log("Atempting to update a value");
                    var newvalues = { $set: {screenname: webSockets[index].username, mins: message.mins, secs: message.secs} };
                    database.collection("Snip Snap Snorum times").updateOne(query, newvalues, function(err, res) {
                        if (err) throw err;
                        console.log("1 Snip Snap Snorum times document updated");
                    });
                }
            }
            else{
                query={screenname: webSockets[index].username, mins: message.mins, secs: message.secs};
                database.collection("Snip Snap Snorum times").insertOne(query, function(err, res) {
                    if (err) throw err;
                    console.log("1 Snip Snap Snorum times document inserted");
                });
                
            }
            console.log(result);
        });
    }

}
if (typeof module === "object") {
    module.exports = Uploader;
 }