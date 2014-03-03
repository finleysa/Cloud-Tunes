/* jshint expr:true */

'use strict';

process.env.DBNAME = 'albums-test';
var app = require('../../app/app');
var request = require('supertest');
var expect = require('chai').expect;
var Album;

describe('albums', function(){

  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      Album = require('../../app/models/album');
      done();
    });
  });

  beforeEach(function(done){
    var s1 = new Album({name:'Get High', artist:'Papa Roach'});
    var s2 = new Album({name:'Dudes', artist:'Britney Spears'});
    var s3 = new Album({name:'Blah', artist:'The Cheerios'});
    
    s1.save(function(){
      s2.save(function(){
        s3.save(function(){
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

  describe('GET /Albums', function(){
    it('should return all Albums in the database', function(done){
      request(app)
      .get('/albums')
      .end(function(err, res){
        expect(res.body.Albums).to.have.length(3);
        expect(res.body.Albums[0].name).to.be.ok;
        expect(res.body.Albums[0]._id).to.have.length(24);
        done();
      });
    });
  });

  describe('POST /Albums', function(){
    it('should create a Album in the database', function(done){
      request(app)
      .post('/albums')
      .send({name:'Hello people',
             artist:'Some Dude',
             album:'Lets Go'})
      .end(function(err, res){
        console.log(res.body.Albums);
        expect(res.body.name).to.be.ok;
        expect(res.body._id).to.have.length(24);
        done();
      });
    });
  });

});
