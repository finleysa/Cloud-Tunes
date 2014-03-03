'use strict';
var Song = require('../models/song');
//var moment = require('moment');

exports.create = function(req, res){
  var song = new Song(req.body);
  song.addSong(req.files.file.path);
  console.log('XXXXXXXXXXXXXXXXXXXXX'+req.files);
  song.save(function(){
    res.send(song);
  });
};

exports.update = function(req, res){
  var song = new Song(req.body);
  song.save(function(){
    res.send(song);
  });
};

exports.index = function(req, res){
  Song.findAll(function(songs){
    res.send({songs:songs});
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
      Song.findByArtist(input, function(songs){
        res.send({songs:songs});
      });
      break;
    case 'album':
      Song.findByAlbum(input, function(songs){
        res.send({songs:songs});
      });
      break;
    case 'name':
      Song.findByName(input, function(song){
        res.send({song:song});
      });
      break;
    case 'ID':
      Song.findById(input, function(song){
        res.send({song:song});
      });
      break;
    default:
  }

};
