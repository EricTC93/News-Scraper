// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");

var request = require("request");
var cheerio = require("cheerio");

// Models
var Article = require("./models/Article.js");

mongoose.Promise = Promise;

// Initialize Express
var app = express();

app.use(express.static("public"));

app.use(methodOverride("_method"));

app.use(bodyParser.urlencoded({
	extended: false
}));

// Database Config
mongoose.connect("mongodb://localhost/newsScraper");
var db = mongoose.connection;

db.on("error", function(err) {
	if (err) throw err;
});

db.once("open", function() {
	console.log("Mongoose connection successful.");
});

// Handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// // Creates test article
// var testArticle = new Article({
// 	title: "Title",
// 	body: "Body",
// 	link: "Link"
// });

// // Saves test article to the database
// testArticle.save(function(err,doc){
// 	if (err) {
// 		console.log(err);
// 	}

// 	else {
// 		console.log(doc);
// 	}
// });

app.get("/",function(req,res) {
	// res.send("Testing");

	Article.find({},function(err,found){

		if (err) {
			console.log(err);
		}

		else {

			var handleBarObj = {
				articles: found
			};

			res.render("index",handleBarObj);
		}
	});
});

// Shows all articles in the database on the webpage
app.get("/api/articles",function(req,res) {

	Article.find({},function(err,found){

		if (err) {
			console.log(err);
		}

		else {
			res.json(found);
		}
	});
});

app.get("/refresh",function(req,res) {

	request("https://www.nytimes.com/", function(err,response,html){
		var $ = cheerio.load(html);

		var results = [];

		// $(".collection .story-heading > a").each(function(i,element) {
		// 	// results.push($(element).children(".story-heading").children("a").attr("href"));
		// 	// results.push(element);

		// 	console.log(element.attr("text"));
		// 	// console.log(element);
		// });

		// // console.log(results[0]);

		$(".collection").each(function(i, element) {
    		var title = $(element).find(".story-heading").find("a").text();
    		var summary = $(element).find(".summary").text();
    		var link = $(element).find(".story-heading").find("a").attr("href");

    		// results.push({ title: title, summary: summary });
			// Creates test article
			var newArticle = new Article({
				title: title,
				summary: summary,
				link: link
			});

			// Saves new article to database if unique
			newArticle.save(function(err,doc){
				// if (err) {
				// 	console.log(err);
				// }
			});

  		});

  		res.redirect("/");

	});

});

// Runs app on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});