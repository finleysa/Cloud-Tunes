//model
'use strict';
module.exports = Song;
var songs = global.nss.db.collection('songs');
var mongo = require('mongodb');
var fs = require('fs');
var path = require('path');

function Song(object){
  this._id = object._id;
  this.name = object.name;
  this.artist = object.artist;
  this.album = object.album;
  this.file = object.file;
  //this.length = object.length;
}

Song.prototype.addArtist = function(artist){
  this.artist = artist;
};

Song.prototype.addAlbum = function(album){
  this.album = album;
};

Song.prototype.save = function(fn){
  var self = this;
  songs.save(self, function(err, record){
    fn(err);
  });
};

Song.findByArtist = function(artist, fn){
  songs.find({artist:artist}).toArray(function(err, records){
    fn(records);
  });
};

Song.findByAlbum = function(album, fn){
  songs.find({album:album}).toArray(function(err, records){
    fn(records);
  });
};

Song.findById = function(id, fn){
  var _id = mongo.ObjectID(id);
  songs.findOne({_id:_id}, function(err, record){
    fn(record);
  });
};

Song.findAll = function(fn){
  songs.find().toArray(function(err, records){
    fn(records);
  });
};

Song.findByName = function(name, fn){
  songs.findOne({name:name}, function(err, record){
    fn(record);
  });
};

Song.prototype.addSong = function(oldpath){
  console.log(oldpath);
  var dirname = this.name.replace(/\s/g, '').toLowerCase();
  var abspath = __dirname + '/../static';
  var relpath = '/audios/' + dirname;
  fs.mkdirSync(abspath + relpath);

  var extension = path.extname(oldpath);
  relpath += '/song' + extension;
  fs.renameSync(oldpath, abspath + relpath);

  this.file = relpath;
};
