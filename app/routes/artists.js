'use strict';
var Artist = require('../models/artist');
//var moment = require('moment');

exports.create = function(req, res){
  var artist = new Artist(req.body);
  console.log(req.body);
  artist.save(function(){
    res.send(artist);
  });
};

exports.update = function(req, res){
  var artist = new Artist(req.body);
  artist.save(function(){
    res.send(artist);
  });
};

exports.index = function(req, res){
  Artist.findAll(function(artists){
    res.send({artists:artists});
  });
};
