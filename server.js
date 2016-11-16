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
        }
    });
}

var getTabs = function(endpoint) {
    var emitter = new events.EventEmitter();
    unirest.get('http://www.songsterr.com/a/ra/songs.json?pattern=' + endpoint)
    .end(function(response) {
        var done = response.body.length;
        for(var i = 0; i < response.body.length; i++){
            (function(index) {
                Item.find({song_id: response.body[index].id}, function(err, item) {
                    if(!err) {
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
    });
    return emitter;
};

app.get('/search/:name', function(req, res) {
    var name = req.params.name;
    var result = getTabs(name);
    result.on('end', function(item) {
        res.json(item);
    });
});

app.get('/favorites', function(req, res) {
    Item.find(function(err, item) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
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
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        return res.json({status: 'true'});
    });
});

app.delete('/favorites/:id', function(req, res) {
    var id = req.params.id;
    Item.findOneAndRemove(id, function(err, item) {
        if(err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(201).json(item);
    });
});
