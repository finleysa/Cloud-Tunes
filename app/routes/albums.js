'use strict';
var Album = require('../models/album');
//var moment = require('moment');

exports.create = function(req, res){
  var album = new Album(req.body);
  album.save(function(){
    res.send(album);
  });
};

exports.update = function(req, res){
  var album = new Album(req.body);
  album.save(function(){
    res.send(album);
  });
};

exports.index = function(req, res){
  Album.findAll(function(albums){
    res.send({albums:albums});
  });
};

exports.filter = function(req, res){
  var type = req.query.type;
  var input = req.query.which.replace('%20', ' ');
  console.log('Type:');
  console.log(type);
  console.log('Input:');
  console.log(input);

  switch(type){
    case 'artist':
      Album.findByArtist(input, function(albums){
        console.log(albums);
        res.send({albums:albums});
      });
      break;
    case 'name':
      Album.findByName(input, function(album){
        res.send({album:album});
      });
      break;
    case 'ID':
      Album.findById(input, function(album){
        res.send({album:album});
      });
      break;
    default:
  }
};
