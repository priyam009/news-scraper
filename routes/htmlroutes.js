// Require Cheerio
var cheerio = require("cheerio");
//Require Axios
var axios = require("axios");
//Require models
var db = require("../models/");

module.exports = function(app) {
  //Render home page
  app.get("/", function(req, res) {
    //Find all articles in db
    db.Article.find({})
      .then(function(dbArticle) {
        // res.json(dbArticle);
        res.render("index", { articles: dbArticle });
      })
      .catch(function(err) {
        res.json(err);
      });
  });
}