var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname,'/public')));

//app.use('/resources',express.static(__dirname,'/Images'));

// viewed at http://localhost:3000
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

//app.listen(3000);
app.listen(process.env.PORT || 8080, function(){});