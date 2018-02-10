const homePageTemplate = (
    '<div></div>'
  );
  
  

  const memeCreationTemplate = (
    '<div></div>'
  );
  
  
  const serverBase = '//localhost:8080/';
  const homePage_URL = serverBase + '/';
  const photoSelection_URL = serverBase + 'photos';
  const memeCreation_URL = serverBase + 'memes'
  
  
  function getAndDisplayMemeFeed_top() {
    console.log('Retrieving top memes')
    const memeTop_URL = homePage_URL + 'top';
    $.getJSON(memeTop_URL, function(memes) {
      console.log('Rendering top memes');
    });
  }

  function getAndDisplayMemeFeed_recent() {
    console.log('Retrieving recent memes')
    const memeRecent_URL = homePage_URL + 'recent';
    $.getJSON(memeRecent_URL, function(memes) {
      console.log('Rendering recent memes');
    });
  }

  function getAndDisplayPhotoFeed_top() {
    console.log('Retrieving top photos')
    const photoTop_URL = photoSelection_URL + '/top';
    $.getJSON(photoTop_URL, function(photos) {
      console.log('Rendering top photos');
      const photoFeedTop = photos.map(function(photo) {
        console.log(photo);
        const photoSelectionTemplate = 
          `<div class='parent'>
            <img class='mySlides' id='${photo.id}' src='${photo.photoURL}'>
            <span class='clickableIcon' id='${photo.id}'><i class='far fa-star'></i></span>
            <button class='selectPhotoButton' id='${photo.id}' type='button'>Create meme with this photo</button>
            <button class="navButtons" id="displayLeft" onclick="plusDivs(-1)">&#10094;</button>
            <button class="navButtons" id="displayRight" onclick="plusDivs(1)">&#10095;</button>
           </div>`;
        return photoSelectionTemplate;
      })
      $('.photoBanner').append(photoFeedTop);
      showDivs(1);
    });
  }

  function getAndDisplayPhotoFeed_recent() {
    console.log('Retrieving recent photos')
    const photoRecent_URL = photoSelection_URL + '/recent';
    $.getJSON(photoRecent_URL, function(photos) {
      console.log('Rendering recent photos');
      const photoFeedRecent = photos.map(function(photo) {
        console.log(photo);
        const photoSelectionTemplate = 
          `<div class='parent'>
            <img class='mySlides' id='${photo.id}' src='${photo.photoURL}'>
            <span class='clickableIcon' id='${photo.id}'><i class='far fa-star'></i></span>
            <button class='selectPhotoButton' id='${photo.id}' type='button'>Create meme with this photo</button>
            <button class="navButtons" id="displayLeft" onclick="plusDivs(-1)">&#10094;</button>
            <button class="navButtons" id="displayRight" onclick="plusDivs(1)">&#10095;</button>
          </div>`;
        return photoSelectionTemplate;
      })
      $('.photoBanner').append(photoFeedRecent);
      
    });
  }

  function getAndDisplayPhotoById(id) {
    console.log('Retrieving photo to display')
    const photoChoice_URL = photoSelection_URL + '/' + id;
    $.getJSON(photoChoice_URL, function(photo) {
      console.log(photo);
      const memeTemplate = `<h1>Create your Meme</h1>
      <div class='memeContainer' style='background-image: url(${photo.photoURL})'>
      <div class='textBox'></div></div>
      <label for='phrase'>Input text for meme</label>
      <input type='text' id='phrase'/><br>
      <button class='submitMemeButton' type='submit'>Submit Meme</button>`;
      $('#view3').append(memeTemplate);
      $('#view2').addClass('hidden');
      $('#view3').removeClass('hidden');
    });
  }
  
  function addPhoto(photo) {
    console.log(photo);
    $.ajax({
      method: 'POST',
      url: photoSelection_URL,
      data: JSON.stringify(photo),
      dataType: 'json',
      contentType: 'application/json'
    });
  }

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
    console.log('Adding meme');
    $.ajax({
      method: 'POST',
      url: memeCreation_URL,
      data: JSON.stringify(meme),
      success: function(data) {
        getAndDisplayShoppingList();
      },
      dataType: 'json',
      contentType: 'application/json'
    });
  }
  
  function deletePhoto(photoId) {
    console.log('Deleting recipe `' + photoId + '`');
    $.ajax({
      url: photoSelectionURL + '/' + photoId,
      method: 'DELETE',
      success: getAndDisplayRecipes
    });
  }
  
  function handleEventListeners() {

    $('.home').on('click', '#create', function(event) {
      $('#view1').addClass('hidden');
      $('#view2').removeClass('hidden');
      getAndDisplayPhotoFeed_top();
    });
  
    $('#photoUpload').submit(function(event) {
      event.preventDefault();
      const photo = $(event.currentTarget).find('#newPhoto').val();
      addPhoto({photoURL: photo,
      liked: 0});
      const createMemeTemplate = `<h1>Create your Meme</h1>
      <div class='memeContainer' style='background-image: url(${photo})'>
      <div class='textBox'></div></div>
      <label for='phrase'>Input text for meme</label>
      <input type='text' id='phrase'/><br>
      <button class='submitMemeButton' type='submit'>Submit Meme</button>`;
      $('#view3').append(createMemeTemplate);
      $('#view2').addClass('hidden');
      $('#view3').removeClass('hidden');
    });

    $('.photoBanner').on('click', '.clickableIcon', function(){
      console.log('liked');
      let icon = $(event.target);
      if (!icon.hasClass('clickableIcon')) {
        icon = icon.closest('.clickableIcon');
      }
      const starId = icon.attr('id');
      updatePhoto(starId);
    });

    $('.photoBanner').on('click', '.selectPhotoButton', function(){
      console.log(event.target);
      const buttonId = $(event.target).attr('id');
      console.log(buttonId);
      getAndDisplayPhotoById(buttonId);

    });
  
  }
  
  
  $(function() {
    handleEventListeners();
  });