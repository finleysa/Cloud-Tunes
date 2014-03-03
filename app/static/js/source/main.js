
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

  var origin = window.location.origin;

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
    //file = instance.listenOnSubmit(document.getElementById('saveSong'), document.getElementById('inputFile'));
    showAlbums();
    showArtists();
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
    console.log(song);
    var $tr = $('<tr>');
    var $title = $('<td>').text(song.name);
    var $artist = $('<td>').text(song.artist);
    var $album = $('<td>').text(song.album);

    $tr.append($album, $artist, $title);
    $('#songBody').append($tr);
  }
  
  function displaySongs(data){
    console.log(data);
    $('#mainArea').empty();
    var $table = $('<table>');
    var $thead = $('<thead>');
    var $tbody = $('<tbody>').attr('id','songBody');
    var $tr = $('<tr>');
    var $th1 = $('<th>').text('Song Title');
    var $th2 = $('<th>').text('Artist');
    var $th3 = $('<th>').text('Album');
    
    $('#mainArea').append($table.append($thead.append($tr.append($th1, $th2, $th3)), $tbody));
    if(data.albums){
      for(var i = 0; i < data.albums.length; i++){
        displaySong(data.albums[i]);
      }
    }else{
      for(var j = 0; j < data.songs.length; j++){
        displaySong(data.songs[j]);
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
    var artist = $(this).children('div:nth-child(4)').text();
    var url = origin + '/albums/filter?type=artist&which='+ artist;
    $.getJSON(url, displaySongs);
  }

})();
