// Dependencies
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
	title: {
		type: String,
    	trim: true,
		unique: true,
		required: true
	},

	body: {
		type: String,
		trim: true,
		unique: true,
		required: true
	}
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;