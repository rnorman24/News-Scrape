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
      $.getJSON("/articles", function(data) {
        console.log(data);
        let articleCards = [];
        // For each one
        for (let article of data) {

          articleCards.push(createCard(article));          
        }
       $("#articles").append(articleCards); 
      });
    })
})

$(document).on("click", "#home-btn", function() {
  event.preventDefault();
  // Make a call for the articles
  $.getJSON("/articles", function(data) {
    console.log(data);
    let articleCards = [];
    // For each one
    for (let article of data) {

      articleCards.push(createCard(article));          
    }
    $("#articles").append(articleCards); 
  });
})


/*
// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (let article of data) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + article._id + "'>" + article.title + "<br />" + article.link + "</p>");
  }
});
*/
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
  $.getJSON("/articles", function(data) {
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
      "<h3>",
      "<a class='card-link' target='_blank' href='" + article.link + "'>",
      article.title,
      "</a>",
      "<a class='btn btn-outline-success save'>",
      "Save Article",
      "</a>",
      "</h3>",
      "<div class='card-body'>",
      article.summary,
      "</div>",
      "</div>"
    ].join("")
  );
  // We attach the article's id to the jQuery element
  // We will use this when trying to figure out which article the user wants to save
  card.data("_id", article._id);
  // We return the constructed panel jQuery element
  return card;
}
