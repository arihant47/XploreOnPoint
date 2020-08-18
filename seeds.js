var mongoose   = require("mongoose");
var Campground = require("./models/campground");
var Comment    = require("./models/comment");

var data = [
	{
		name: "Cloud's Rest", 
		image: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",
		description: "Blah Blah Blah"
	},
	
	{
		name: "Canyon Floor", 
		image: "https://images.unsplash.com/photo-1490452322586-70484206da38?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",
		description: "Blah Blah Blah"
	},
	
	{
		name: "Desert Mesa", 
		image: "https://images.unsplash.com/photo-1487750404521-0bc4682c48c5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",
		description: "Blah Blah Blah"
	},
]

function seedDB(){
	//Remove all campgrounds
	Campground.remove({}, function(err){
		if(err){
			console.log(err);
		}
		console.log("Removed!!");
		
		//Add a few campgrounds
		data.forEach(function(seed){
			Campground.create(seed, function(err, campground){
				if(err) {
					console.log(err)
				} else {
					console.log("Added a Campground");
					
					//create a comment
					Comment.create(
					{
						text: "This place is great, but I wish there was internet",
						author: "Homer"
					}, function(err, comment){
						if(err){
							console.log(err);
						} else {
							campground.comments.push(comment);
							campground.save();
							console.log("Created new comment");
						}
					});
				}
			});
		});
	});	
	
	
}

module.exports = seedDB;