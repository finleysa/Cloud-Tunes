//unit test - song
/*jshint expr: true*/
'use strict';

process.env.DBNAME= 'music-test';
var expect = require('chai').expect;
var exec = require('child_process').exec;
var fs = require('fs');
var Song;


describe('Song', function(){

  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      Song = require('../../app/models/song');
      done();
    });
  });

  beforeEach(function(done){
    var testdir = __dirname + '/../../app/static/img/test*';
    var cmd = 'rm -rf ' + testdir;

    exec(cmd, function(){
      var origfile = __dirname + '/../fixtures/tempPhoto.jpg';
      var copyfile = __dirname + '/../fixtures/tempPhoto-copy.jpg';
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copyfile));
      global.nss.db.dropDatabase(function(err,result){
        done();
      });
    });
  });

/* Constructor  */

  describe('new', function(){
    it('should create a new song object', function(){
      var obj = {};
      obj.name = 'Purple Rain';
      obj.artist = 'Prince';
      obj.album = 'Purple Rain';
      var song = new Song(obj);
      expect(song).to.be.instanceof(Song);
    });
  });

/* Instance  */

  describe('#addArtist', function(){
    it('should add the artist name', function(){
      var obj = {};
      obj.name = 'test Purple Rain';
      var song = new Song(obj);
      song.addArtist('Prince');
      expect(song.artist).to.equal('Prince');
    });
  });

  describe('#addAlbum', function(){
    it('should add the album name', function(){
      var obj = {};
      obj.name = 'test Purple Rain';
      var song = new Song(obj);
      song.addAlbum('Purple Rain');
      expect(song.album).to.equal('Purple Rain');
    });
  });

  describe('#save', function(){
    it('should save a Song object into the DB', function(done){
      var obj = {};
      obj.name = 'Purple Rain';
      obj.artist = 'Prince';
      obj.album = 'Purple Rain';
      var song = new Song(obj);
      //var oldname = __dirname + '/../fixtures/tempPhoto-copy.jpg';
      //album.addPhoto(oldname);

      song.save(function(err){
        expect(err).to.be.null;
        expect(song).to.be.instanceof(Song);
        expect(song).to.have.property('_id').and.be.ok;
        expect(song._id.toString()).to.have.length(24);
        done();
      });
    });
  });
/*
describe('#insert', function(){
    it('should insert a new Album into Mongo', function(done){
      var o = {};
      o.title = 'Test Euro Vacation';
      o.taken = '2010-03-25';
      var a1 = new Album(o);
      var oldname = __dirname + '/../fixtures/euro-copy1.jpg';
      a1.addMP3(oldname);
      a1.insert(function(err){
        expect(a1._id.toString()).to.have.length(24);
        done();
      });
    });
  });
*
/* Find */

  describe('.findByArtist', function(){
    it('should find all songs by artist', function(done){
      var obj = {};
      var obj2= {};
      obj.name = 'Purple Rain';
      obj2.name = 'Green Rain';
      obj.artist = 'Prince';
      obj2.artist = 'Prince';
      var song = new Song(obj);
      var song2 = new Song(obj2);
      song.save(function(){
        song2.save(function(){
          Song.findByArtist('Prince', function(songs){
            expect(songs).to.have.length(2);
            done();
          });
        });
      });
    });
  });

  describe('.findByAlbum', function(){
    it('should find all songs by album', function(done){
      var obj = {};
      var obj2= {};
      obj.name = 'Purple Rain';
      obj2.name = 'Green Rain';
      obj.album = 'Purple Rain';
      obj2.album = 'Purple Rain';
      var song = new Song(obj);
      var song2 = new Song(obj2);
      song.save(function(){
        song2.save(function(){
          Song.findByAlbum('Purple Rain', function(songs){
            expect(songs).to.have.length(2);
            done();
          });
        });
      });
    });
  });

  describe('.findById', function(){
    it('should find an Song by its ID', function(done){
      var obj = {};
      obj.name = 'Purple Rain';
      obj.artist = 'Prince';
      obj.album = 'Purple Rain';
      var song = new Song(obj);

      song.save(function(err){
        var id = song._id.toString();
        console.log(id);
        Song.findById(id, function(song){
          expect(song.name).to.equal('Purple Rain');
          done();
        });
      });
    });
  });

  describe('.findAll', function(){
    it('should find all the Songs in the database', function(done){
      var obj = {};
      obj.name = 'Purple Rain';
      obj.artist = 'Prince';
      obj.album = 'Purple Rain';
      var song = new Song(obj);

      song.save(function(err){
        Song.findAll(function(songs){
          expect(songs).to.have.length(1);
          done();
        });
      });
    });
  });

  describe('.findByName', function(){
    it('should find a Song by its name', function(done){
      var obj = {};
      obj.name = 'Purple Rain';
      obj.artist = 'Prince';
      obj.album = 'Purple Rain';
      var song = new Song(obj);

      song.save(function(err){
        Song.findByName(song.name, function(record){
          expect(record.name).to.equal(song.name);
          done();
        });
      });
    });
  });

});
