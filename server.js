// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");

var request = require("request");
var cheerio = require("cheerio");

// Models
var Article = require("./models/Article.js");
var Comment = require("./models/Comment.js");

mongoose.Promise = Promise;

// Initialize Express
var app = express();

app.use(express.static("public"));

app.use(methodOverride("_method"));

app.use(bodyParser.urlencoded({
	extended: false
}));

// Database Config
// mongoose.connect("mongodb://localhost/newsScraper");
mongoose.connect("mongodb://heroku_8sgpg11x:6p6k8ecmfvnj6smbq6a0rahurg@ds115738.mlab.com:15738/heroku_8sgpg11x");
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

// Displays articles and comments stored in the database
app.get("/",function(req,res) {

	// Sorts by time scraped
	Article.find({}).sort({scrapedAt: -1}).populate("comments").exec(function(err,found){

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

// Shows all articles in the database
app.get("/api/articles",function(req,res) {

	Article.find({}).populate("comments").exec(function(err,found){

		if (err) {
			console.log(err);
		}

		else {
			res.json(found);
		}
	});
});

// Retrieves new articles form the nyt website
app.get("/refresh",function(req,res) {

	request("https://www.nytimes.com/", function(err,response,html){
		var $ = cheerio.load(html);

		var results = [];

		var date = Date.now();

		$(".collection").each(function(i, element) {
    		var title = $(element).find(".story-heading").find("a").text();
    		var summary = $(element).find(".summary").text();
    		var link = $(element).find(".story-heading").find("a").attr("href");

			var newArticle = new Article({
				title: title,
				summary: summary,
				link: link,
				scrapedAt: date
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

app.post("/addComment/:_id", function(req,res){
	
	// Creates comment
	var newComment = new Comment(req.body);

	newComment.save(function(err,doc){
		if (err) {
			console.log(err);
			res.redirect("/");
		}

		else {
			Article.findOneAndUpdate({"_id":req.params._id},{ $push: {"comments":doc._id}}, 
				function(nextErr, newDoc){
					if (nextErr) {
						console.log(nextErr);
					}

					else {
						// console.log(doc);
						res.redirect("/");
					}
				});
		}
	});
});

// Runs app on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});