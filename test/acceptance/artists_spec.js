/* jshint expr:true */

'use strict';

process.env.DBNAME = 'artists-test';
var app = require('../../app/app');
var request = require('supertest');
var expect = require('chai').expect;
var Artist;

describe('artists', function(){

  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      Artist = require('../../app/models/artist');
      done();
    });
  });

  beforeEach(function(done){
    var a1 = new Artist({name:'Pink Floyd', photo:'/blah/blah'});
    var a2 = new Artist({name:'Rand Tyler', photo:'/blah/blah'});
    var a3 = new Artist({name:'Peaches Malone', photo:'/blah/blah'});

    a1.save(function(){
      a2.save(function(){
        a3.save(function(){
          done();
        });
      });
    });
  });

  afterEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      done();
    });
  });

  describe('GET /artists', function(){
    it('should return all artists in the database', function(done){
      request(app)
      .get('/artists')
      .end(function(err, res){
        expect(res.body.artists).to.have.length(3);
        expect(res.body.artists).to.be.ok;
        expect(res.body.artists[0]._id).to.have.length(24);
        done();
      });
    });
  });

  describe('POST /artists', function(){
    it('should create a Artist in the database', function(done){
      request(app)
      .post('/artists')
      .send({name:'Hello people',
             photo:'../../stuff'})
      .end(function(err, res){
        console.log(res.body.artists);
        expect(res.body.name).to.be.ok;
        expect(res.body._id).to.have.length(24);
        done();
      });
    });
  });

});
