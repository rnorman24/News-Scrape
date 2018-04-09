initPage();

$(document).on("click", "#articles-btn", function() {
  event.preventDefault();
  // Make a call for the articles
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
    // With that done, add articles to page
    .done(function() {
      initPage();
    })
})

$(document).on("click", "#home-btn", function() {
  event.preventDefault();
  initPage();
})

$(document).on("click", ".save", function() {
  event.preventDefault();
  saveArticle();
})

// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  const thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(article) {
      console.log(article);
      // The title of the article
      $("#notes").append("<h2>" + article.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + article._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (article.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(article.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(article.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  const thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

function initPage() {
  // Empty the article container, run an AJAX request for any unsaved headlines
  $("#articles").empty();
  $.getJSON("/articles?saved=false", function(data) {
    console.log(data);
    let articleCards = [];
    // For each one
    for (let article of data) {

      articleCards.push(createCard(article));          
    }
    $("#articles").append(articleCards); 
  });
}

function createCard(article) {
  // This functiont takes in a single JSON object for an article/headline
  // It constructs a jQuery element containing all of the formatted HTML for the
  // article panel
  const card = $(
    [
      "<div class='card-header'>",
      "<h3 class='d-flex'>",
      "<a class='card-link' target='_blank' href='" + article.link + "'>",
      article.title,
      "</a>",
      "<a class='btn btn-outline-success save ml-auto'>",
      "Save Article",
      "</a>",
      "</h3>",
      "<div class='card-body'>",
      article.summary,
      "</div>",
      "</div>"
    ].join("")
  );
  // The article's id is attached to the jQuery element
  // This will be used when trying to figure out which article the user wants to save
  card.data("_id", article._id);
  // return the constructed card jQuery element
  return card;
}

function saveArticle() {
  // This function is triggered when the user wants to save an article
  // When we rendered the article initially, we attatched a javascript object containing the headline id
  // to the element using the .data method. Here we retrieve that.
  const articleToSave = $(this).parents(".card").data();
  articleToSave.saved = true;
  // Using a patch method to be semantic since this is an update to an existing record in our collection
  $.ajax({
    method: "PUT",
    url: "/articles",
    data: articleToSave
  }).then(function(data) {
    // If successful, mongoose will send back an object containing a key of "ok" with the value of 1
    // (which casts to 'true')
    if (data.ok) {
      // Run the initPage function again. This will reload the entire list of articles
      initPage();
    }
  });
}
