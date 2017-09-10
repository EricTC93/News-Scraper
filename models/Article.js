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

	summary: {
		type: String,
		trim: true,
		unique: true,
		required: true
	},

	link: {
		type: String,
		trim: true,
		// unique: true,
		// required: true
	}
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;