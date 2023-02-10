/*
if (typeof Uploader === "undefined") {
    Card = require('./LoginHandler');
  }
  //*/
class LoginHandler{

    constructor(collection){
        this.database=collection;
        //sockets this.Sockets=sockets;
    }
/*
    findWS(ws){
        return this.Sockets.indexOf(ws);
    }
*/
    //Insert a connection into the database
    //Return passed in socket when completed
    createlogin(action,ws,webSockets){
        let good=true;
        console.log("Setting up a login");
        console.log('received: %s', action.user + " "+ action.password);
        
        var myobj = { name: action.user, screenname: action.screenname, password: action.password };
        var query = { screenname: action.screenname};
        var self = this;

        this.database.collection("Logins").find(query).toArray(function(err, result) {
            if (err) throw err;
            let index=webSockets.indexOf(ws);
            if(result.length > 0){
                console.log("User name already exists");
                let mes={};
                mes.action="Creation";
                mes.status="That screenname already exists";
                webSockets[index].send(JSON.stringify(mes));
            }
            else{
                self.database.collection("Logins").insertOne(myobj, function(err, res) {
                    if (err) throw err;
                    console.log("1 user document inserted");
                });
                ws.logedIn=true;
                webSockets[index].logedIn=true;
                ws.username=action.screenname;
                webSockets[index].username=action.screenname;
                console.log("websocket login is "+ws.username);
                console.log("websocket list login is "+webSockets[index].username);
                
                let mes={};
                mes.action="Show user";
                mes.user=action.user;
                webSockets[index].send(JSON.stringify(mes));
                
                mes.action="Creation";
                mes.status="Succesfully created an account";
                webSockets[index].send(JSON.stringify(mes));
                console.log("We are tring to log in");
                console.log("Loged in");
            }
            console.log(result);
        });
        return webSockets;
    }

    //Login to the website
    //Check if given name and pass are in the database
    //If not do not allow login
    login(action,ws,webSockets){
        let good=false;
        console.log("Attempting to log in");
        //console.log('received: %s', action.user + " "+ action.password);
        var query = { screenname: action.user, password: action.password};
        var self = this;
       
        this.database.collection("Logins").find(query).toArray(function(err, result) {
            if (err) throw err;
            let mes={};
            let index=webSockets.indexOf(ws);
            console.log("We are tring to log in");
            console.log(result);
            if(result.length>0){
                console.log("The username and pass are good");
                ws.logedIn=true;
                webSockets[index].logedIn=true;
                ws.username=action.user;
                webSockets[index].username=action.user;
                console.log("login websocket login is " + ws.username);
                console.log("login websocket list login is " + webSockets[index].username);
                
                mes.action="Show user";
                mes.user=action.user;
                webSockets[index].send(JSON.stringify(mes));
                
                mes.action="Login";
                mes.status="Succesfully logged in";
                console.log("Succesfully logged in");
                webSockets[index].send(JSON.stringify(mes));
            }
            else{
                console.log("Username or Password not found. Login Failed");
                mes.action="Login";
                mes.status="Login failed. Username or password not found";
        
                webSockets[index].send(JSON.stringify(mes));
            }
            console.log("Login");
            console.log(result);
        });
        
        return webSockets;
    }


}
if (typeof module === "object") {
    module.exports = LoginHandler;
 }