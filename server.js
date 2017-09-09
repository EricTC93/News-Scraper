// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// Models

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

app.get("/",function(req,res) {
	res.send("Hello World");
});

app.listen(3000, function() {
  console.log("App running on port 3000!");
});