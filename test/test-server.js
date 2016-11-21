global.DATABASE_URL = 'mongodb://localhost/node-capstone-test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');

var should = chai.should();
var expect = chai.expect();
var app = server.app;
var storage = server.storage;

var Item = require('../models/item');

chai.use(chaiHttp);

describe('Tests', function() {
    before(function(done) {
        server.runServer(function() {
            "Running Server for tests";
            Item.create({name: "Little Feat",
                         title: "Spanish Moon",
                         song_id: 12345,
                         _id: '582fc9b32e4bd616cb76cd4f'
            });
            done();
        });
    });
    describe('Favorite Tabs', function() {
        it('should get items on get', function(done) {
            chai.request(app)
                .get('/search/phish')
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    //check up on figuring out how to check if greater than
                    // res.body.should.have.length();
                    done();
                });
        });
        it('should list favorite items on get', function(done) {
            chai.request(app)
                .get('/favorites')
                .end(function(err, res){
                    res.should.have.status(200);
                    res.should.be.a('object');
                    res.should.be.json;
                    res.body[0].should.have.property('name');
                    res.body[0].name.should.be.a('string');
                    res.body[0].name.should.equal('Little Feat');
                    res.body[0].should.have.property('title');
                    res.body[0].title.should.be.a('string');
                    res.body[0].title.should.equal('Spanish Moon');
                    res.body[0].should.have.property('song_id');
                    res.body[0].song_id.should.be.a('number');
                    res.body[0].song_id.should.equal(12345);
                    res.body[0].should.have.property('_id');
                    res.body[0]._id.should.equal('582fc9b32e4bd616cb76cd4f');
                    done();
            });
        });
        it('should post items on post', function(done) {
            chai.request(app)
                .get('/favorites')
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.a('object');
                    res.should.be.json;
                    res.body[0].should.have.property('name');
                    res.body[0].name.should.be.a('string');
                    res.body[0].name.should.equal('Little Feat');
                    res.body[0].should.have.property('title');
                    res.body[0].title.should.be.a('string');
                    res.body[0].title.should.equal('Spanish Moon');
                    res.body[0].should.have.property('song_id');
                    res.body[0].song_id.should.be.a('number');
                    res.body[0].song_id.should.equal(12345);
                    res.body[0].should.have.property('_id');
                    done();
                });
        });
    });
    after(function(done){
        Item.remove(function(){
          done(); 
        });
    });
});
