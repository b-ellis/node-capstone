var express = require('express');
var unirest = require('unirest');
var events = require('events');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');

var app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

var Item = require('./models/item');

var runServer = function(callback) {
    mongoose.connect(config.DATABASE_URL, function(err){
        if (err && callback) {
            return callback(err);
        }

        app.listen(config.PORT, function() {
            console.log('Listening on localhost:' + config.PORT);
            if (callback) {
                callback();
            }
        });
    });
};

if (require.main === module) {
    runServer(function(err) {
        if (err) {
            console.error(err);
        } else {
            console.log("Server up and running well!");
        }
    });
}

var getTabs = function(endpoint) {
    var emitter = new events.EventEmitter();
    unirest.get('http://www.songsterr.com/a/ra/songs.json?pattern=' + endpoint)
    .end(function(response) {
        if(response.ok){
           var done = response.body.length;
            for(var i = 0; i < response.body.length; i++){
                (function(index) {
                    Item.find({song_id: response.body[index].id}, function(err, item) {
                        if(item.length > 0) {
                            response.body[index].star = true;
                        } else {
                            response.body[index].star = false;
                        }
                        done--;
                        if(done == 0){
                            emitter.emit('end', response.body);
                        }
                    });
                })(i);
            } 
        } else {
            emitter.emit('error', response.code);
        }
    });
    return emitter;
};

app.get('/search/:name', function(req, res) {
    var name = req.params.name;
    if (!name) {
        res.status(404).json({status: "no name parameter provided in request."});
    }
    var result = getTabs(name);
    result.on('end', function(item) {
        res.json(item);
    });
    result.on('error', function(err) {
        res.status(404).json({status: "Weren't able to contact songsterr api."});
    });
});

app.get('/favorites', function(req, res) {
    Item.find(function(err, item) {
        if (err) {
            return res.status(404).json({
                message: 'Could not retrieve favorites'
            });
        }
        res.json(item);
    });
});

app.post('/favorites', function(req, res) {
    Item.create({
        name: req.body.name,
        title: req.body.title,
        song_id: req.body.song_id
    }, function(err, item) {
        if(err) {
            return res.status(404).json({
                message: 'Could not add item to favorites'
            });
        }
        return res.json({status: 'true'});
    });
});

app.delete('/favorites/:id', function(req, res) {
    var id = req.params.id;
    Item.findOneAndRemove({song_id:id}, function(err, item) {
        console.log("error " + err);
        if(err) {
            return res.status(404).json({
                message: 'Could not remove item from favorites'
            });
        }
        res.status(201).json(item);
    });
});

exports.app = app;
exports.runServer = runServer;