//unit test - album
/*jshint expr: true*/
'use strict';

process.env.DBNAME= 'music-test';
var expect = require('chai').expect;
var exec = require('child_process').exec;
var fs = require('fs');
var Album;
var Song;

describe('Album', function(){

  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      Album = require('../../app/models/album');
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

  //Passing or un-needed tests (commented out for performance purposes)

// Constructor

  describe('new', function(){
    it('should create a new Album object', function(){
      var obj = {};
      obj.name = 'Purple Rain';
      obj.artist = 'Prince';
      obj.year = 1983;
      obj.songs = [];
      var album = new Album(obj);
      expect(album).to.be.instanceof(Album);
    });
  });

// Instance

  describe('#addArtist', function(){
    it('should add the artist name', function(){
      var obj = {};
      obj.name = 'test Purple Rain';
      obj.year = 1983;
      obj.songs = [];
      var album = new Album(obj);
      album.addArtist('Prince');
      expect(album.artist).to.equal('Prince');
    });
  });

  describe('#addPhoto', function(){
    it('should add a photo to Album', function(){
      var obj = {};
      obj.name = 'test Purple Rain';
      obj.artist = 'Prince';
      obj.year = 1983;
      obj.songs = [];
      var album = new Album(obj);
      var oldname = __dirname + '/../fixtures/tempPhoto-copy.jpg';
      album.addPhoto(oldname);
      expect(album.photo).to.equal('/img/testpurplerain/photo.jpg');
    });
  });

  describe('#addSong', function(){
    it('should add a song to the songs property', function(done){
      var aObj = {};
      var sObj = {};
      aObj.name = 'test Purple Rain';
      aObj.name = 'test Purple Rain';
      aObj.songs = [];
      var album = new Album(aObj);
      var song = new Song(sObj);
      album.save(function(){
        song.save(function(){
          var songId = song._id.toString();
          album.addSong(songId);
          expect(album.songs).to.have.length(1);
          expect(album.songs[0]).to.be.equal(songId);
          expect(album.songs[0].name).to.equal(song.name);
          done();
        });
      });
    });
  });

  describe('#save', function(){
    it('should save a Album object into the DB', function(done){
      var obj = {};
      obj.name = 'test Purple Rain';
      obj.artist = 'Prince';
      obj.year = 1983;
      obj.songs = [];
      var album = new Album(obj);
      var oldname = __dirname + '/../fixtures/tempPhoto-copy.jpg';
      album.addPhoto(oldname);

      album.save(function(err){
        expect(err).to.be.null;
        expect(album).to.be.instanceof(Album);
        expect(album).to.have.property('_id').and.be.ok;
        expect(album._id.toString()).to.have.length(24);
        done();
      });
    });
  });

// Find

  describe('.findByArtist', function(){
    it('should find all albums by artist', function(done){
      var obj = {};
      var obj2= {};
      obj.name = 'test Purple Rain';
      obj2.name = 'test Green Rain';
      obj.artist = 'Prince';
      obj2.artist = 'Prince';
      var album = new Album(obj);
      var album2 = new Album(obj2);
      album.save(function(){
        album2.save(function(){
          Album.findByArtist('Prince', function(albums){
            expect(albums).to.have.length(2);
            done();
          });
        });
      });
    });
  });

  describe('.findById', function(){
    it('should find an Album by its ID', function(done){
      var obj = {};
      obj.name = 'test Purple Rain';
      obj.artist = 'Prince';
      obj.year = 1983;
      obj.songs = [];
      var album = new Album(obj);
      var oldname = __dirname + '/../fixtures/tempPhoto-copy.jpg';
      album.addPhoto(oldname);

      album.save(function(err){
        var id = album._id.toString();
        console.log(id);
        Album.findById(id, function(album){
          expect(album.name).to.equal('test Purple Rain');
          done();
        });
      });
    });
  });


  describe('.findAll', function(){
    it('should find all the Albums in the database', function(done){
      var obj = {};
      obj.name = 'test Purple Rain';
      obj.artist = 'Prince';
      obj.year = 1983;
      obj.songs = [];
      var album = new Album(obj);
      var oldname = __dirname + '/../fixtures/tempPhoto-copy.jpg';
      album.addPhoto(oldname);

      album.save(function(err){
        Album.findAll(function(albums){
          expect(albums).to.have.length(1);
          done();
        });
      });
    });
  });

  describe('.findByName', function(){
    it('should find an Album by its name', function(done){
      var obj = {};
      obj.name = 'test Purple Rain';
      obj.artist = 'Prince';
      obj.year = 1983;
      obj.songs = [];
      var album = new Album(obj);
      var oldname = __dirname + '/../fixtures/tempPhoto-copy.jpg';
      album.addPhoto(oldname);

      album.save(function(err){
        Album.findByName(album.name, function(record){
          expect(record.name).to.equal(album.name);
          done();
        });
      });
    });
  });

});
