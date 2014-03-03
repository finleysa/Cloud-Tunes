//model
'use strict';
module.exports = Artist;
var fs = require('fs');
var path = require('path');
var artists = global.nss.db.collection('artists');
var mongo = require('mongodb');

function Artist(object){
  this._id = object._id;
  this.name = object.name;
  this.photo = object.photo;
}

/* Instance Methods */

Artist.prototype.addPhoto = function(oldname){
  var dirname = this.name.replace(/\s/g,'').toLowerCase();
  var abspath = __dirname + '/../static';
  var relpath = '/img/' + dirname;
  fs.mkdirSync(abspath + relpath);

  var extension = path.extname(oldname);
  relpath += '/photo' + extension;
  fs.renameSync(oldname, abspath + relpath);

  this.photo = relpath;
};

//albumId = string
Artist.prototype.addAlbum = function(albumId){
  this.albums.push(albumId);
};

/*
Artist.prototype.insert = function(fn){
  artists.insert(this, function(err, record){
    fn(err);
  });
};
*/


Artist.prototype.save = function(fn){
  if (this._id.length === 24){
    this._id = mongo.ObjectID(this._id);
  }else{
    delete this._id;
  }
  var self = this;
  console.log(self+'ooooooooooooooooooxxxxxxxxx');
  artists.save(self, function(err, record){
    fn(record);
  });
};

/* Find Methods */

Artist.findById = function(id, fn){
  var _id = mongo.ObjectID(id);
  artists.findOne({_id:_id}, function(err, record){
    fn(record);
  });
};

Artist.findByName = function(name, fn){
  artists.findOne({name:name}, function(err, record){
    fn(record);
  });
};

Artist.findAll = function(fn){
  artists.find().toArray(function(err, records){
    fn(records);
  });
};
