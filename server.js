var express = require('express');
var unirest = require('unirest');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var getTabs = function(endpoint) {
    unirest.get('http://www.songsterr.com/a/ra/songs.xml?pattern=' + endpoint)
    .end(function(response) {
        if (response.ok) {
            console.log(response.body);
        } else {
            console.log('could not fetch data');
        }
    });    
};

var app = express();
app.use(express.static('public'));

app.get('/search/:name', function(req, res) {
    var name = req.params.name;
    console.log(req.params.name);
    getTabs(name);
});


app.listen(process.env.PORT || 8080);