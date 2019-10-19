// Require Cheerio
var cheerio = require("cheerio");
//Require Axios
var axios = require("axios");
//Require models
var db = require("../models/");

module.exports = function(app) {
  //Get all articles
  app.get("/articles", function(req, res) {
    //Find all articles in db
    db.Article.find({ saved: false })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  //Get saved articles
  app.get("/saved", function(req, res) {
    //Find all articles in db
    db.Article.find({ saved: true })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  //Scrape new articles
  app.get("/scrape", function(req, res) {
    db.Article.remove({ saved: false }).then(function() {
      //Scrape articles from news.com.au
      axios.get("https://www.news.com.au/").then(function(response) {
        var $ = cheerio.load(response.data);

        var result = [];

        $(".story-block").each(function(i, element) {
          title = $(element)
            .children(".heading")
            .children("a")
            .text();

          link = $(element)
            .children(".image-link")
            .attr("href");

          brief = $(element)
            .children(".standfirst")
            .children(".standfirst-text")
            .text()
            .trim();

          //Push articles in results array if it has valid title, link and brief
          if (title && link && brief) {
            result.push({
              title: title,
              link: link,
              brief: brief
            });
          }
        });

        //Create Articles in db
        db.Article.create(result)
          .then(function() {
            res.json(true);
          })
          .catch(function(err) {
            console.log(err);
          });
      });
    });
  });

  // Delete all articles
  app.get("/delete", function(req, res) {
    // Remove all articles from the db
    db.Article.remove().then(function() {
      res.json(true);
    });
  });

  app.put("/bookmark/:id", function(req, res) {
    // console.log("id", req.params.id);
    var id = req.params.id;

    db.Article.findOneAndUpdate(
      { _id: id },
      { saved: req.body.saved },
      function(result) {
        // console.log(result);
        res.json(true);
      }
    );
  });

  app.get("/saved/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("note")
      .then(function(dbNote) {
        res.json(dbNote);
      });
  });

  app.post("/saved/:id", function(req, res) {
    db.Note.create(req.body)
      .then(function(dbNote) {
        return db.Article.findOneAndUpdate(
          { _id: req.params.id },
          { $push: { note: dbNote._id } }
        );
      }, { new: true })
      .then(function(dbArticle) {
        console.log("this", dbArticle);
        res.json(dbArticle);
      });
  });

  app.get("/notes", function(req, res) {
    db.Note.find({})
    .then(function(dbNote) {
      res.json(dbNote);
    })
    .catch(function(err) {
      res.json(err);
    });
  })

    // Delete note
    app.get("/note/delete/:id", function(req, res) {
      // Remove all articles from the db
      db.Note.remove({_id: req.params.id}).then(function() {
        res.json(true);
      });
    });
};
