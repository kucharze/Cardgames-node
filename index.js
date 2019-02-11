var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname,'/public')));

//app.use('/resources',express.static(__dirname,'/Images'));

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(3000);