var express    = require("express");
var router     = express.Router();
var Campground = require("../models/campground");

//INDEX route (Shows all campgrounds) --> GET
router.get("/", function(req, res){	
	//Get all campgrounds from the DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});
});

//CREATE route (Add new campground to database) -->POST
router.post("/", function(req, res){
	//get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = {name: name, image: image, description: desc}
	// campgrounds.push(newCampground);
// 	Instead of the above line we need to create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err) {
			console.log(err);
		} else {
			//redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	});	
});

//NEW route (Show form to create new campground)  --> GET
router.get("/new", function(req, res){
	res.render("campgrounds/new");
});

//SHOW route (Shows more info about one campground) --> GET
//This should always be done after /campgrounds/new otherwise new will be treated as /:id 
router.get("/:id", function(req, res){
	//Find the campground with provided id
	// Campground.findById is an mongoose command
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			console.log(foundCampground);
			//Render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

module.exports = router;
