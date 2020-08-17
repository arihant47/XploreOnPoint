var express     = require("express");
var app         = express();
var bodyParser  = require("body-parser");
var mongoose    = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp"); //This will create a database inside mongoDB
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

//Make a model which uses campgroundSchema so that we can use various mongoDB methods
var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
// 	{
// 		name: "Granite Hill", 
// 		image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",
// 		description: "This is a huge granite hill, no bathrooms, no water. Beautiful Granite!"
// 	}, function(err, campground){
// 		if(err){
// 			console.log(err);
// 		} else {
// 			console.log("Newly created campground: ");
// 			console.log(campground);
// 		}
// 	});

app.get("/", function(req, res){
	res.render("landing");
});

//INDEX route (Shows all campgrounds) --> GET
app.get("/campgrounds", function(req, res){
	//Get all campgrounds from the DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("index", {campgrounds: allCampgrounds});
		}
	});
});

//CREATE route (Add new campground to database) -->POST
app.post("/campgrounds", function(req, res){
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
app.get("/campgrounds/new", function(req, res){
	res.render("new");
});

//SHOW route (Shows more info about one campground) --> GET
//This should always be done after /campgrounds/new otherwise new will be treated as /:id 
app.get("/campgrounds/:id", function(req, res){
	//Find the campground with provided id
	// Campground.findById is an mongoose command
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			//Render show template with that campground
			res.render("show", {campground: foundCampground});
		}
	});
});

app.listen(3000, function(){
	console.log("The YelpCamp Server has started");
});