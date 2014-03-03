//model
'use strict';
module.exports = Album;
var fs = require('fs');
var path = require('path');
var albums = global.nss.db.collection('albums');
var mongo = require('mongodb');

function Album(object){
  this._id = object._id;
  this.name = object.name;
  this.artist = object.artist;
  this.year = parseInt(object.year);
  this.cover = object.cover;
}

Album.prototype.addArtist = function(artist){
  this.artist = artist;
};

Album.prototype.addPhoto = function(oldname){
  var dirname = this.name.replace(/\s/g,'').toLowerCase();
  var abspath = __dirname + '/../static';
  var relpath = '/img/' + dirname;
  fs.mkdirSync(abspath + relpath);

  var extension = path.extname(oldname);
  relpath += '/photo' + extension;
  fs.renameSync(oldname, abspath + relpath);

  this.photo = relpath;
};

//songId = string
Album.prototype.addSong = function(songId){
  this.songs.push(songId);
};

Album.prototype.save = function(fn){
  console.log(this);
  if (this._id.length === 24){
    this._id = mongo.ObjectID(this._id);
  }else{
    delete this._id;
  }
  var self = this;
  console.log(self+'ooooooooooooooooooxxxxxxxxx');
  albums.save(self, function(err, record){
    fn(record);
  });
};

Album.findByArtist = function(artist, fn){
  console.log('Find By Artist:');
  console.log(artist);
  albums.find({artist:artist}).toArray(function(err, records){
    console.log('Records:');
    console.log(records);
    fn(records);
  });
};

Album.findById = function(id, fn){
  var _id = mongo.ObjectID(id);
  albums.findOne({_id:_id}, function(err, record){
    fn(record);
  });
};

Album.findAll = function(fn){
  albums.find().toArray(function(err, records){
    fn(records);
  });
};

Album.findByName = function(name, fn){
  console.log('NAME:::::');
  console.log(name);
  albums.findOne({name:name}, function(err, record){
    fn(record);
  });
};
