/* jshint expr:true */

'use strict';

process.env.DBNAME = 'songs-test';
var app = require('../../app/app');
var request = require('supertest');
var expect = require('chai').expect;
var Song;
var id1;
var id2;
var id3;
var s1;
var s2;
var s3;

describe('songs', function(){

  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      Song = require('../../app/models/song');
      done();
    });
  });

  beforeEach(function(done){
    s1 = new Song({name:'Get High', artist:'Papa Roach', album: 'Spacejam'});
    s2 = new Song({name:'Dudes', artist:'Britney Spears', album: 'Hit Me Baby'});
    s3 = new Song({name:'Blah', artist:'The Cheerios', album: 'Breakfast'});

    s1.save(function(){
      s2.save(function(){
        s3.save(function(){
          id1 = s1._id.toString();
          id2 = s2._id.toString();
          id3 = s3._id.toString();
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

  describe('GET /songs', function(){
    it('should return all songs in the database', function(done){
      request(app)
      .get('/songs')
      .end(function(err, res){
        expect(res.body.songs).to.have.length(3);
        expect(res.body.songs).to.be.ok;
        expect(res.body.songs[0]._id).to.have.length(24);
        done();
      });
    });
  });

  describe('POST /songs', function(){
    it('should create a song in the database', function(done){
      request(app)
      .post('/songs')
      .send({name:'Hello people',
             artist:'Some Dude',
             album:'Lets Go'})
      .end(function(err, res){
        expect(res.body.name).to.be.ok;
        expect(res.body._id).to.have.length(24);
        done();
      });
    });
  });

  describe('GET /songs/filter?type=artist', function(){
    it('shoud return all songs by artist', function(done){
      request(app)
      .get('/songs/filter?type=artist&which='+s1.artist)
      .end(function(err, res){
        console.log('done!');
        done();
      });
    });
  });



});
