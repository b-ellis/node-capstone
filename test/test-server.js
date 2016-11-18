
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');

var should = chai.should();
var app = server.app;
var storage = server.storage;

chai.use(chaiHttp);

describe('Tests', function() {
     before(function(done) {
         server.runServer(function() {
             "Running Server for tests";
             done();
         });
     });
     describe('Favorite Tabs', function() {
         it('should list items on get', function(done) {
             chai.request(app)
                 .get('/favorites')
                 .end(function(err, res){
                     res.should.have.status(200);
                     done();
             });
    });
     // it('should post items on post', function(done) {
     //    chai.request(app)
     //     //   .get('/favorites')
     //       .end(function(err, res) {
     //
     //             done();
     //         });
     // });
     // it('should delete items on delete', function(done) {
     //     chai.request(app)
     //         // .get('/favorites')
     //         .end(function(err, res){
     //
     //             done();
     //         });
     // });

})
});
