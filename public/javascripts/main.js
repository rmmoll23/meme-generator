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
    const photoTop_URL = photoSelection_URL;
    $.getJSON(photoTop_URL, function(photos) {
      console.log('Rendering top photos');
      console.log(photos);
      const photoFeedTop = photos.map(function(photo) {
        const photoSelectionTemplate = 
          `<img class="mySlides" id='${photo.id}' src='${photo.photoURL}'>`;
        return photoSelectionTemplate;
      })
      $('.photoBanner').prepend(photoFeedTop);
    });
  }

  function getAndDisplayPhotoFeed_recent() {
    console.log('Retrieving recent photos')
    const photoRecent_URL = photoSelection_URL + '/recent';
    $.getJSON(photoRecent_URL, function(photos) {
      console.log('Rendering recent photos');
    });
  }
  
  
  function addPhoto(photo) {
    console.log(photo);
    $.ajax({
      method: 'POST',
      url: photoSelection_URL,
      // success: function(data) {
      //   getAndDisplayPhotoFeed_top();
      // },
      data: JSON.stringify(photo),
      dataType: 'json',
      contentType: 'application/json'
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
      $('#view2').addClass('hidden');
      $('#view3').removeClass('hidden');
    });
  
  }
  
  
  $(function() {
    handleEventListeners();
  });