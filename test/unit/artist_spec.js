//unit test - artist
/*jshint expr: true*/
'use strict';

process.env.DBNAME= 'music-test';
var expect = require('chai').expect;
var exec = require('child_process').exec;
var fs = require('fs');
var Artist;
var Album;
var id;

describe('Artist', function(){
  var artist;

  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      Artist = require('../../app/models/artist');
      Album = require('../../app/models/album');
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
        var obj = {};
        obj.name = 'testPrince';
        obj.albums = [];
        artist = new Artist(obj);
        var oldname = __dirname + '/../fixtures/tempPhoto-copy.jpg';
        artist.addPhoto(oldname);
        artist.save(function(err){
          id = artist._id.toString();
          done();
        });
      });
    });
  });

/* Constructor */

  describe('new', function(){
    it('should create a new Artist object', function(){
      expect(artist).to.be.instanceof(Artist);
    });
  });

  describe('#addPhoto', function(){
    it('should add a photo to Artist', function(){
      expect(artist.photo).to.equal('/img/testprince/photo.jpg');
    });
  });

  describe('#save', function(){
    it('should save a Artist object into the DB', function(done){
      //expect(err).to.be.null;
      expect(artist).to.be.instanceof(Artist);
      expect(artist).to.have.property('_id').and.be.ok;
      expect(artist._id.toString()).to.have.length(24);
      done();
    });
  });

  describe('#addAlbum', function(){
    it('should add an Album to the albums array', function(done){
      var aObj = {};
      aObj.name = 'test Purple Rain';
      aObj.artist = 'Prince';
      aObj.year = 1983;
      aObj.songs = [];
      var album = new Album(aObj);
      album.save(function(){
        var albumId = album._id.toString();
        artist.addAlbum(albumId);
        expect(artist.albums).to.have.length(1);
        expect(artist.albums[0]).to.be.equal(albumId);
        done();
      });
    });
  });


/* Find */
  describe('.findById', function(){
    it('should find an Artist by its ID', function(done){
      Artist.findById(id, function(artist){
        expect(artist.name).to.equal('testPrince');
        done();
      });
    });
  });

  describe('.findAll', function(){
    it('should find all the Artists in the database', function(done){
      Artist.findAll(function(artists){
        expect(artists).to.have.length(1);
        done();
      });
    });
  });

  describe('.findByName', function(){
    it('should find an Artist by its name', function(done){
      Artist.findByName(artist.name, function(record){
        expect(record.name).to.equal(artist.name);
        done();
      });
    });
  });

});
