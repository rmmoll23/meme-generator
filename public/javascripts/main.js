"use strict";
  
  const serverBase = 'https://meme-generator-capstone.herokuapp.com/'
  // const serverBase = '//localhost:8080/';
  const photoSelection_URL = serverBase + 'photos';
  const memeCreation_URL = serverBase + 'memes'
  
  
  function getAndDisplayMemeFeed_top() {
    $('body').loader('show');
    console.log('Retrieving top memes')
    const memeTop_URL = memeCreation_URL + '/top';
    $.getJSON(memeTop_URL, function(memes) {
      const memeFeedTop = memes.map(function(meme) {
        const memeFeedTopTemplate = 
          `<div class='parent'>
            <img class='mySlides' id='${meme.id}' src='${meme.memeURL}'>
            <span class='clickableMemeIcon' id='${meme.id}'><i class='far fa-star'></i>${meme.liked}</span>
            <button class="navButtons" id="displayLeft" onclick="plusDivs(-1)">&#10094;</button>
            <button class="navButtons" id="displayRight" onclick="plusDivs(1)">&#10095;</button>
           </div>`;
        return memeFeedTopTemplate;
      })
      $('.memeBanner').empty();
      $('.memeBanner').append(memeFeedTop);
      slideIndex = 1;
      showDivs(1);
      $('body').loader('hide');
    });
  }

  function getAndDisplayMemeFeed_recent() {
    $('body').loader('show');
    const memeRecent_URL = memeCreation_URL + '/recent';
    $.getJSON(memeRecent_URL, function(memes) {
      console.log('Rendering recent memes');
      const memeFeedRecent = memes.map(function(meme) {
        const memeFeedTemplate = 
          `<div class='parent'>
            <img class='mySlides' id='${meme.id}' src='${meme.memeURL}'>
            <span class='clickableMemeIcon' id='${meme.id}'><i class='far fa-star'></i>${meme.liked}</span>
            <button class="navButtons" id="displayLeft" onclick="plusDivs(-1)">&#10094;</button>
            <button class="navButtons" id="displayRight" onclick="plusDivs(1)">&#10095;</button>
           </div>`;
        return memeFeedTemplate;
      })
      $('.memeBanner').empty();
      $('.memeBanner').append(memeFeedRecent);
      slideIndex = 1;
      showDivs(1);
      $('body').loader('hide');
    });
  }

  function getAndDisplayPhotoFeed_top() {
    $('body').loader('show');
    const photoTop_URL = photoSelection_URL + '/top';
    $.getJSON(photoTop_URL, function(photos) {
      console.log('Rendering top photos');
      const photoFeedTop = photos.map(function(photo) {
        const photoSelectionTemplate = 
          `<div class='parent'>
            <div class='photo'>
              <img class='mySlides' id='${photo.id}' src='${photo.photoURL}'>
              <span class='clickableIcon' id='${photo.id}'><i class='far fa-star'></i>${photo.liked}</span>
              <button class="navButtons" id="displayLeft" onclick="plusDivs(-1)">&#10094;</button>
              <button class="navButtons" id="displayRight" onclick="plusDivs(1)">&#10095;</button>
            </div>
            <button class='selectPhotoButton' id='${photo.id}' type='button'>Create meme with this photo</button>
           </div>`;
        return photoSelectionTemplate;
      })
      $('.memeBanner').empty();
      $('.photoBanner').empty();
      $('.photoBanner').append(photoFeedTop);
      slideIndex = 1;
      showDivs(1);
      $('body').loader('hide');
    });
  }

  function getAndDisplayPhotoFeed_recent() {
    $('body').loader('show');
    const photoRecent_URL = photoSelection_URL + '/recent';
    $.getJSON(photoRecent_URL, function(photos) {
      console.log('Rendering recent photos');
      const photoFeedRecent = photos.map(function(photo) {
        const photoSelectionRecentTemplate = 
          `<div class='parent'>
            <div class='photo'>
              <img class='mySlides' id='${photo.id}' src='${photo.photoURL}'>
              <span class='clickableIcon' id='${photo.id}'><i class='far fa-star'></i>${photo.liked}</span>
              <button class="navButtons" id="displayLeft" onclick="plusDivs(-1)">&#10094;</button>
              <button class="navButtons" id="displayRight" onclick="plusDivs(1)">&#10095;</button>
            </div>
            <button class='selectPhotoButton' id='${photo.id}' type='button'>Create meme with this photo</button>
          </div>`;
        return photoSelectionRecentTemplate;
      })
      $('.memeBanner').empty();
      $('.photoBanner').empty();
      $('.photoBanner').append(photoFeedRecent);
      slideIndex = 1;
      showDivs(1);
      $('body').loader('hide');
    });
  }

  function getAndDisplayPhotoById(id) {
    console.log('Retrieving photo to display')
    const photoChoice_URL = photoSelection_URL + '/' + id;
    $.getJSON(photoChoice_URL, function(photo) {
      const memeTemplate = `<h1>Create your Meme</h1>
      <div class='imgChoice'>
      <div class='memeContainer' style='background-image: url(${photo.photoURL})'>
      <div id='textBox'>hello</div></div></div>
      <form id='memeSubmit'>
      <label for='phrase'>Input text for meme</label>
      <input type='text' id='phrase' onkeyup='memeText()'/><br>
      <button class='submitMemeButton' type='submit'>Submit Meme</button>
      </form>`;
      // $('#memeCreationPage').empty();
      $('#memeCreationPage').append(memeTemplate);
      $('#photoSelectionPage').addClass('hidden');
      $('#memeCreationPage').removeClass('hidden');
    });
  }
  
  // function addPhoto(photo) {
  //   console.log(photo);
  //   $.ajax({
  //     method: 'POST',
  //     url: photoSelection_URL,
  //     data: JSON.stringify(photo),
  //     dataType: 'json',
  //     contentType: 'application/json'
  //   });
  // }

  function updatePhoto(id) {
    console.log('Updating photo `' + id + '`');
    $.ajax({
      url: photoSelection_URL + '/' + id,
      method: 'PUT',
      success: function(data) {
        getAndDisplayPhotoFeed_top();
      }
    });
  }
  
  function addMeme(meme) {
    const memePath = {memeURL: meme,
      liked: 0}
    console.log('Adding meme'); 
    $.ajax({
      method: 'POST',
      url: memeCreation_URL,
      data: JSON.stringify(memePath),
      dataType: 'json',
      contentType: 'application/json',
      success: function(data) {
        getAndDisplayMemeFeed_top();
      }
    });
    $('.photoBanner').empty();
    $('#memeCreationPage').addClass('hidden');
    $('#homePage').removeClass('hidden');

  }

  function updateMeme(id) {
    console.log('Updating meme `' + id + '`');
    $.ajax({
      url: memeCreation_URL + '/' + id,
      method: 'PUT',
      success: function(data) {
        getAndDisplayMemeFeed_top();
      }
    });
  }
  
  // function deletePhoto(photoId) {
  //   console.log('Deleting recipe `' + photoId + '`');
  //   $.ajax({
  //     url: photoSelectionURL + '/' + photoId,
  //     method: 'DELETE',
  //     success: getAndDisplayRecipes
  //   });
  // }

  function memeText() {
    let input = $('#phrase').val();
    let div = $('#textBox').html();
    if (input !== div) {
        $('#textBox').empty();
        $('#textBox').append(input);
    }
  }
  
  function handleEventListeners() {

    $('.home').on('click', '#create', function(event) {
      $('#homePage').addClass('hidden');
      $('#photoSelectionPage').removeClass('hidden');
      getAndDisplayPhotoFeed_top();
    });
  
    // $('#photoUpload').submit(function(event) {
    //   event.preventDefault();
    //   const photo = $(event.currentTarget).find('#newPhoto').val();
    //   addPhoto({photoURL: photo,
    //   liked: 0});
    //   const createMemeTemplate = `<h1>Create your Meme</h1>
    //   <div class='imgChoice'>
    //   <div class='memeContainer' style='background-image: url(${photo})'>
    //   <div id='textBox'></div></div></div>
    //   <form id='memeSubmit'>
    //   <label for='phrase'>Input text for meme</label>
    //   <input type='text' id='phrase' onkeyup='memeText()'/><br>
    //   <button class='submitMemeButton' type='submit'>Submit Meme</button>
    //   </form>`;
    //   $('#memeCreationPage').empty();
    //   $('#memeCreationPage').append(createMemeTemplate);
    //   $('#photoSelectionPage').addClass('hidden');
    //   $('#memeCreationPage').removeClass('hidden');
    // });

    $('.photoBanner').on('click', '.clickableIcon', function(){
      console.log('liked');
      let icon = $(event.target);
      if (!icon.hasClass('clickableIcon')) {
        icon = icon.closest('.clickableIcon');
      }
      const starId = icon.attr('id');
      updatePhoto(starId);
    });

    $('.memeBanner').on('click', '.clickableMemeIcon', function(){
      console.log('liked');
      let memeIcon = $(event.target);
      if (!memeIcon.hasClass('clickableMemeIcon')) {
        memeIcon = memeIcon.closest('.clickableMemeIcon');
      }
      const memeId = memeIcon.attr('id');
      updateMeme(memeId);
    });

    $('.photoBanner').on('click', '.selectPhotoButton', function(){
      const buttonId = $(event.target).attr('id');
      console.log(buttonId);
      getAndDisplayPhotoById(buttonId);
    });

    $('#memeFilter').click(function() {
      $('#memeFilter').toggleClass('checked');
      let classState = $('#memeFilter').attr('class');
      console.log(classState);
      if (classState === 'checked') {
        console.log('true');
        $('#recent').addClass('selectedFilter');
        $('#top').removeClass('selectedFilter');
        getAndDisplayMemeFeed_recent();
      }
      
      else {
        console.log('false');
        $('#top').addClass('selectedFilter');
        $('#recent').removeClass('selectedFilter');
        getAndDisplayMemeFeed_top();
        
      }
    })

    $('#photoFilter').click(function() {
      $('#photoFilter').toggleClass('checked');
      let classState = $('#photoFilter').attr('class');
      console.log(classState);
      if (classState === 'checked') {
        console.log('true');
        $('#recentPhoto').addClass('selectedFilter');
        $('#topPhoto').removeClass('selectedFilter');
        getAndDisplayPhotoFeed_recent();
      }
      
      else {
        console.log('false');
        $('#topPhoto').addClass('selectedFilter');
        $('#recentPhoto').removeClass('selectedFilter');
        getAndDisplayPhotoFeed_top();
        
      }
    })

    $('#memeCreationPage').on('click', '.submitMemeButton', function(){
      event.preventDefault();
      console.log('snapshot');
      html2canvas(document.querySelector(".memeContainer")).then(canvas => {
        // console.log(canvas);
        const memeDataURL = canvas.toDataURL();
        console.log(memeDataURL);
        addMeme(memeDataURL);
      });
    });
  
  }
  
  
  $(function() {
    handleEventListeners();
    // getAndDisplayMemeFeed_top();
  });