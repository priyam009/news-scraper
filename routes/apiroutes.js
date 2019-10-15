var cheerio = require("cheerio");
var axios = require("axios");

module.exports = function(app) {
  app.get("/", function(req, res) {
    res.render("index");
  })

  app.get("/scrape", function(req, res) {

    var query = ["https://www.news.com.au/", "https://www.news.com.au/world", "https://www.news.com.au/technology", "https://www.news.com.au/sport", "https://www.news.com.au/finance", "https://www.news.com.au/entertainment"]

    var count = Math.floor(Math.random() * 6)

    axios.get(query[count]).then(function(response) {

      var $ = cheerio.load(response.data);
      
      var result = [];

      $(".story-block").each(function(i, element) {
        // var result = {};
        
        heading = $(element).children(".heading").children("a").text();

        link = $(element).children(".image-link").attr("href");

        story = $(element).children(".standfirst").children(".standfirst-text").text().trim();

        if(heading && link && story) {
          result.push({
            heading: heading,
            link: link,
            story: story
          });
        }

      });

      console.log(result);
    });
  });
};