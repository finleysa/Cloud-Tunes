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
    var a1 = new Album({name:'Get High', artist:'Papa Roach'});
    var a2 = new Album({name:'Dudes', artist:'Britney Spears'});
    var a3 = new Album({name:'Blah', artist:'The Cheerios'});

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

  describe('GET /albums', function(){
    it('should return all albums in the database', function(done){
      request(app)
      .get('/albums')
      .end(function(err, res){
        expect(res.body.albums).to.have.length(3);
        expect(res.body.albums).to.be.ok;
        expect(res.body.albums[0]._id).to.have.length(24);
        done();
      });
    });
  });
/*
  describe('POST /albums', function(){
    it('should create a Album in the database', function(done){
      request(app)
      .post('/albums')
      .send({name:'Hello people',
             artist:'Some Dude',
             album:'Lets Go'})
      .end(function(err, res){
        console.log(res.body.albums);
        expect(res.body.name).to.be.ok;
        expect(res.body._id).to.have.length(24);
        done();
      });
    });
  });
*/
});
