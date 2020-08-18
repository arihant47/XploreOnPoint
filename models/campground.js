var mongoose = require("mongoose");

//Schema Model Setup
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

//Make a model which uses campgroundSchema so that we can use various mongoDB methods
module.exports = mongoose.model("Campground", campgroundSchema);