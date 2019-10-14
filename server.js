//Require express
var express = require("express");
//Require express handlebars
var exphbs = require("express-handlebars");
//Require mongoose
var mongoose = require("mongoose");

//Add PORT
var PORT = process.env.PORT || 3000;

//Instantiate Express
var app = express();

//Parse request body as JSON
app.use(express.urlencoded({ extended:true }));
app.use(express.json());

//Static files
app.use(express.static("./public"));

//Connect Handlebar to Express
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

require("./routes/apiroutes")(app);

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

app.listen(PORT, function() {
  console.log("Listening on port http://localhost:" + PORT);
})