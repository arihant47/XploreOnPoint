var express    = require("express");
var router     = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");  //It will also wordk if you don't write /index.js

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
router.post("/", middleware.isLoggedIn, function(req, res){
	//get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, image: image, description: desc, author: author}
	// campgrounds.push(newCampground);
// 	Instead of the above line we need to create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err) {
			console.log(err);
		} else {
			//redirect back to campgrounds page
			console.log(newlyCreated);
			res.redirect("/campgrounds");
		}
	});	
});

//NEW route (Show form to create new campground)  --> GET
router.get("/new", middleware.isLoggedIn, function(req, res){
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

//Edit Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

//Update Campground Route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	//Find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err) {
			res.redirect("/campgrounds");
		} else {
			//Redirect somewhere(show page)
			res.redirect("/campgrounds/"+req.params.id);
		}
	});	
});

//Destroy Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;
