// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// Models
var Article = require("./models/Article.js");

mongoose.Promise = Promise;

// Initialize Express
var app = express();

app.use(bodyParser.urlencoded({
	extended: false
}));

// Database Config
mongoose.connect("mongodb://localhost/test");
var db = mongoose.connection;

db.on("error", function(err) {
	if (err) throw err;
});

db.once("open", function() {
	console.log("Mongoose connection successful.");
});

// Creates test article
var testArticle = new Article({
	title: "Title",
	body: "Body"
});

// Saves test article to the database
testArticle.save(function(err,doc){
	if (err) {
		console.log(err);
	}

	else {
		console.log(doc);
	}
});

// Shows all articles in the database on the webpage
app.get("/",function(req,res) {

	Article.find({},function(err,found){
		if (err) {
			console.log(err);
		}

		else {
			res.json(found);
		}
	});

});

// Runs app on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});