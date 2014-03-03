/* jshint unused:false */
'use strict';

(function(){

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
    $('.playPause').click(playPause);
    $('.archer').click(archer);
    $('.million').click(million);
    $('.next').click(next);
    $('.back').click(back);
    $('.repeat').click(toggleRepeat);
    player();
  }

  ////////GLOBALS//////////
  var origin = window.location.origin;
  var time;
  var paused;
  var repeat = false;
  var playlist = [];
  var position = 0;
  var max = 0;


  ////////JPLAYER ////////
  function player(){
    $('#jquery_jplayer_1').jPlayer({
      ready: function () {
        console.log('Ready!');
      },
      ended: function (event) {
        next();
      },
      swfPath: 'swf',
      supplied: 'mp3',
      cssSelector: {
        seekBar: '.seek-bar',
        playBar: '.play-bar'
      }
    });

    $('#jquery_jplayer_1').bind($.jPlayer.event.timeupdate, function(event) {
        time = event.jPlayer.status.currentTime;
        $('#time').text(time);
      });
  }


  ////////CONTROLS ////////
  function playPause(){
    paused = $('#jquery_jplayer_1').data().jPlayer.status.paused;
    if(paused===true){
      $('#jquery_jplayer_1').jPlayer('play', time);
      //css set to play
    }
    else if(paused===false){
      $('#jquery_jplayer_1').jPlayer('pause', time);
      //css set to pause
    }
  }

  function playNew(file){
    $('#jquery_jplayer_1').jPlayer('setMedia', {mp3: origin+'/audios/'+file}).jPlayer('play');
  }

  function next(){
    console.log('next!');
    event.preventDefault();
    if(position < max){
      position += 1;
      playNew(playlist[position]);
    }
    else if(repeat===true){
      position = 0;
      playNew(playlist[position]);
    }
  }

  function back(){
    console.log('back!');
    event.preventDefault();
    if(position > 0){
      position -= 1;
      playNew(playlist[position]);
    }
    else if(repeat===true){
      position = max;
      playNew(playlist[position]);
    }
  }


  ////////PLAYLIST////////
  function addToPlaylist(file){
    playlist.push(file);
    updatePlaylistText();
    if(playlist.length===1){
      playNew(playlist[0]);
      max = 0;
    }
    else{
      max++;
    }
  }

  function updatePlaylistText(){
    $('#playlist').text(playlist);
  }

  function toggleRepeat(){
    //should make this noticeable in UI later
    repeat = !repeat;
  }


  ////////FILES////////
  function archer(){
    var tempFile = 'archer.mp3';
    addToPlaylist(tempFile);
  }

  function million(){
    var tempFile = 'million.m4a';
    addToPlaylist(tempFile);
  }


  //Plan B for audio player
  //loads one audio file onto page
  //src = orgin + /audios/ + filename
/*
  function loadMusic(){
    console.log('Loading!');
    var url = origin + '/audios/archer.mp3';
    var $song = ('<audio class="staging" preload="auto" autobuffer="auto" controls="controls">');
    var $source = ('<source src="'+url+'">');
    console.log($song);
    console.log($source);
    $('#body').append($song);
    $('.staging').append($source);
    $('.staging').removeClass('staging');
    event.preventDefault();
  }

  //for dev purposes, can be removed
  setInterval(function(){
      paused = $('#jquery_jplayer_1').data().jPlayer.status.paused;
      console.log('Is Paused: ' + paused);
    }, 1000);
*/

})();
