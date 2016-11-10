var mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({
    name: {type: String, required: true},
    title: {type: String, required: true},
    song_id: {type: String, required: true}
});

var Item = mongoose.model('Item', itemSchema);
module.exports = Item;