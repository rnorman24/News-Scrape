const axios = require("axios");
const cheerio = require("cheerio");

const scrape = function(cb) {

app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get("https://www.nytimes.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(response.data);
    
    // Now, we grab every h2 within an article tag, and do the following:
    $("div.first-column-region div.collection article.theme-summary").each(function(i, element) {
      // Save an empty result object
      const result = {};
      // Add the title and summary of every article, and save them as properties of the result object
      result.title = $(this)
        .children("h2")
        .children("a").text();
      result.link = $(this)
        .children("h2")
        .children("a").attr("href");
      result.summary = $(this)
        .children("p.summary")        
        .text().trim();
      if (result.summary === "") {
        result.summary = $(this)
          .children("ul")
          .children("li")
          .text();
      }
      // Create a new Article using the `result` object built from scraping
      db.Article
        .create(result)
        .then(function(dbArticle) {
          // If we were able to successfully scrape and save an Article, send a message to the client
          // res.json(dbArticle);
          
          
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          res.json(err);
        });
    });
    
  });
});
};

module.exports = scrape;