/* jshint unused:false */

(function(){

  'use strict';

  $(document).ready(initialize);
  $('#addArtist').click(showArtistForm);
  $('#addAlbum').click(showAlbumForm);
  $('#addSong').click(showSongForm);
  $('input[type="text"]').focus(function(){
    $(this).addClass('focusField');
  });
  $('input[type="text"]').blur(function(){
    $(this).removeClass('focusField');
  });
  var albumId;
  var origin = window.location.origin;
  $('.playPause').click(playPause);
  $('.next').click(next);
  $('.back').click(back);
  $('.repeat').click(toggleRepeat);
  player();
//---- Show Forms

  function showArtistForm(){
    $('#submitSong').css('display', 'none');
    $('#submitAlbum').css('display', 'none');
    $('#submitArtist').slideToggle('fast');
  }

  function showAlbumForm(){
    $('#submitSong').css('display', 'none');
    $('#submitArtist').css('display', 'none');
    $('#submitAlbum').slideToggle('fast');
  }

  function showSongForm(){
    $('#submitArtist').css('display', 'none');
    $('#submitAlbum').css('display', 'none');
    $('#submitSong').slideToggle('fast');
  }

//----
  var artists = [];
  //var albums = [];

  function initialize(){
    $(document).foundation();
    //$('#mainArea').on('click','.album', showSongs);
    //$('#mainArea').on('click','.artist', showArtists);
    $('#saveArtist').click(addArtist);
    $('#saveAlbum').click(addAlbum);
    //$('#saveSong').click(addSong);
    $('#showArtists').click(showArtists);
    $('#showAlbums').click(showAlbums);
    $('#showSongs').click(showSongs);
    $(function(){
      $('#mainArea').on('click', '.editArtist', editArtist);
      $('#mainArea').on('click', '.editArtist', function(event){
        event.stopImmediatePropagation();
      });
    });
    $('#mainArea').on('click', '.editAlbum', editAlbum);
    $('#mainArea').on('click', '.editing', addArtist);
    $('#mainArea').on('click', '.editingAlbum', addAlbum);
    $('#mainArea').on('click', '.photo', filterArtist);
    $('#mainArea').on('click', '.albumPhoto', filterAlbum);
    $('#mainArea').on('click', '.tNow', playNew);
    //file = instance.listenOnSubmit(document.getElementById('saveSong'), document.getElementById('inputFile'));
    showAlbums();
    showArtists();
    $('.repeat').css('background-color', 'grey');
  }

  /////////SHOW FUNCTIONS////////
  function showArtists(){
    $('#artistSelect').empty();
    $('#artist').empty();
    var url = origin + '/artists';
    $.getJSON(url, displayArtists);
  }

  function showAlbums(){
    $('.selectAlbum').empty();
    var url = origin + '/albums/';
    $.getJSON(url, displayAlbums);
  }

  function showSongs(){
    var url = origin + '/songs/';
    $.getJSON(url, displaySongs);
  }
  /////////END SHOW FUNCTIONS////////

  ////////ADD FUNCTIONS///////
  function addArtist(err){
    if ($(this).attr('id') === 'editing'){
      $(this).attr('id','saveArtist');
    }
    var url = origin + '/artists';
    var data = $('#submitArtist').serialize();
    var type = 'POST';
    var success = newArtist;
    $.ajax({url:url, type:type, data:data, success:success});
    event.preventDefault(err);
  }

  function newArtist(artist){
    $('#submitArtist')[0].reset();
    displayArtist(artist);
  }

  function addAlbum(err){
    if ($(this).attr('id') === 'editing'){
      $(this).attr('id','saveArtist');
    }
    showAlbums();
    var url = origin + '/albums';
    var data = $('#submitAlbum').serialize();
    var type = 'POST';
    var success = newAlbum;
    $.ajax({url:url, type:type, data:data, success:success});
    event.preventDefault(err);
  }

  function newAlbum(album){
    $('input').val('');
    $('#mainArea').empty();
    $('#submitArtist')[0].reset();
    displayAlbum(album);
  }
  /*
  function addSong(err){
    //showSongs();
    event.preventDefault(err);
  }
  function newSong(song){
    $('#inputSong').val('');
    $('#submitArtist')[0].reset();
    displaySong(song);
  }
*/
  ////////DISPLAY FUNCTIONS////////
  //displays one artist at a time on the to the #mainArea
  function displayArtist(artist){
    artists.push(artist);
    var $photo = $('<div>').attr('data-artist-id', artist._id);
    var $name = $('<div>').addClass('name');
    var $header = $('<div>').addClass('footer');
    //var $footer = $('<a>').addClass('footer');
    // push artists to select box
    var $option = $('<option>').text(artist.name);
    $('.artist').append($option);

    // add edit button
    var $edit = $('<div>').text('edit');
    $edit.addClass('editArtist');

    $photo.addClass('photo grow');
    var url = 'url("'+artist.photo+'")';
    $photo.css('background-image', url);
    $name.text(artist.name);

    var $headertxt = $('<div style="float:left; padding:5px;"></div>');
    $headertxt.text(artist.name);
    $header.append($headertxt);
    $photo.append($header);
    $photo.prepend($edit);
    $('#mainArea').prepend($photo);
  }

  function displayArtists(data){
    $('#mainArea').empty();
    for(var i = 0; i < data.artists.length; i++){
      displayArtist(data.artists[i]);
    }
  }


  function displayAlbum(album){
    var $option = $('<option>').text(album.name);
    $('#album').append($option);
    var $photo = $('<div>').attr('data-album-id', album._id);
    var $name = $('<div>').addClass('name');
    var $header = $('<div>').addClass('footer');
    var $year = $('<div>').addClass('footer albumyear');
    var $artist = $('<div>').addClass('artist hide');
    $year.text(album.year);
    $artist.text(album.artist);

    var $edit = $('<div>').text('edit');
    $edit.addClass('editAlbum');

    $photo.addClass('albumPhoto grow');
    var url = 'url("'+album.cover+'")';
    $photo.css('background-image', url);
    $name.text(album.name);

    var $headertxt = $('<div style="float:left; padding:5px;"></div>');
    $headertxt.text(album.name);
    $header.append($headertxt);

    $photo.append($header, $edit, $year, $artist);
    $('#mainArea').prepend($photo);
  }

  function displayAlbums(data){
    $('#mainArea').empty();
    for(var i = 0; i < data.albums.length; i++){
      displayAlbum(data.albums[i]);
    }
  }

  function displaySong(song){
    var $tr = $('<tr>').addClass('tRow');
    var $title = $('<td>').addClass('td title').text(song.name);
    var $artist = $('<td>').addClass('td artist').text(song.artist);
    var $album = $('<td>').addClass('td album').text(song.album);
    var $tNow = $('<button>').addClass('tNow tiny').text('Play Now!');
    $title.attr('data-file', song.file);
    $title.append($tNow);
    console.log(song);

    $tr.append($title, $artist, $album);
    $('#songBody').append($tr);
  }

  function displaySongs(data){
    debugger;
    console.log(data);
    $('#mainArea').empty();
    var $containDiv = $('<div>').addClass('songTable');
    var $table = $('<table>').addClass('songTable');
    var $thead = $('<thead>').addClass('tHead');
    var $tbody = $('<tbody>').attr('id','songBody');
    var $tr = $('<tr>');
    var $th1 = $('<th>').text('Song Title');
    var $th2 = $('<th>').text('Artist');
    var $th3 = $('<th>').text('Album');
    var $tfoot = $('<tfoot>').addClass('tFoot');
    $tfoot.append($tr);
    $table.append($thead.append($tr.append($th1, $th2, $th3)), $tbody);
    $table.append($tfoot);
    $containDiv.append($table);
    $('#mainArea').append($containDiv);
    if(data.songs){
      for(var i = 0; i < data.songs.length; i++){
        displaySong(data.songs[i]);
      }
    }else{
      for(var j = 0; j < data.albums.length; j++){
        displayAlbum(data.albums[j]);
      }
    }
  }
  ////////END DISPLAY FUNCTIONS////////

  ////////EDIT FUNCTIONS////////
  
  function editArtist(){
    $('#saveArtist').attr('id', 'editing');
    $('#artistName').val($(this).siblings().children('div').text());
    showAlbums();
    var x = $(this).parent().css('background-image');
    $('#artistPhoto').val(x);
    $('#artistId').val($(this).parent().attr('data-artist-id'));
    showArtistForm();
  }
  
  function editAlbum(){
    $('#saveAlbum').attr('id', 'editingAlbum');
    $('#albumName').val($(this).siblings().children('div').text());
    $('#albumYear').val($(this).siblings('.albumyear').text());
    $('#artistSelect').val($(this).siblings('.artist').text());
    var x = $(this).parent().css('background-image');
    $('#albumPhoto').val(x);
    $('#albumId').val($(this).parent().attr('data-album-id'));
    showAlbumForm();
  }

  //////////FILTERS/////////
  function filterArtist(){
    var artist = $(this).children('.footer').text();
    var url = origin + '/albums/filter?type=artist&which='+ artist;
    $.getJSON(url, displayAlbums);
  }

  function filterAlbum(){
    $('#mainArea').empty();
    albumId = this.dataset.albumId;
    var artist = $(this).children('div:nth-child(4)').text();
    var url = origin + '/albums/filter?type=artist&which='+ artist;
    $.getJSON(url, displaySongs);
  }
        
//  function individualizeAlbum(data){
//    var songs = $.map(data, function(value, index){return [value];});
//    var song = _.filter(songs, function(albumId){return albumId;});
//    debugger;
//    console.log(song);
     //displaySongs
//  }
//
//


  ////////GLOBALS//////////
  var time;
  var paused;
  var repeat = false;
  var playlist = [];
  var playlistNames = [];
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
        $('#time').text(Math.floor(time));
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

  function playNew(){
    var file = $($(this)[0].parentNode).attr('data-file');
    $('#jquery_jplayer_1').jPlayer('setMedia', {mp3: origin+file}).jPlayer('play');
    playlistAdd(file);
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
  function addToPlaylist(){
    var file = $($(this)[0].parentNode).attr('data-file');
    playlist.push(file);
    playlistNames.push(file);
    updatePlaylistText();
    if(playlist.length===1){
      playNew(playlist[0]);
      max = 0;
    }
    else{
      max++;
    }
  }

  //called by playNew()
  function playlistAdd(file){
    playlist.push(file);
    playlistNames.push(file);
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
    if(repeat===true){$('.repeat').css('background-color', 'grey');}
    else if(repeat===false){$('.repeat').css('background-color', '#008cba');}
    repeat = !repeat;
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
