const homePageTemplate = (
    '<div></div>'
  );
  
  const photoSelectionTemplate = (
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
    console.log('Adding photo');
    $.ajax({
      method: 'POST',
      url: photoSelection_URL,
      success: function(data) {
        getAndDisplayPhotoFeed_recent();
      },
      dataType: 'json',
      contentType: 'application/json'
    });
  }
  
  function addMeme(meme) {
    console.log('Adding meme');
    $.ajax({
      method: 'POST',
      url: memeCreation_URL,
      data: JSON.stringify(item),
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
  
    $('#photoUpload').submit(function(event) {
      event.preventDefault();
      addPhoto({
        photoURL: $(event.currentTarget).find('#newPhoto').val(),
      });
    });
  
  }
  
  
  $(function() {
    getAndDisplayMemeFeed_top();
    getAndDisplayMemeFeed_recent();
    handleEventListeners();
  });