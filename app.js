var express     = require("express");
var app         = express();
var bodyParser  = require("body-parser");
var mongoose    = require("mongoose");
var Campground  = require("./models/campground");
var Comment     = require("./models/comment");
var seedDB      = require("./seeds");



mongoose.connect("mongodb://localhost/yelp_camp"); //This will create a database inside mongoDB
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
seedDB();



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
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
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
	res.render("campgrounds/new");
});

//SHOW route (Shows more info about one campground) --> GET
//This should always be done after /campgrounds/new otherwise new will be treated as /:id 
app.get("/campgrounds/:id", function(req, res){
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

// ***************    COMMENTS  ROUTES    *****************

app.get("/campgrounds/:id/comments/new", function(req, res){
	//Find campground by id
	Campground.findById(req.params.id, function(err, campground){
		if(err) {
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});	
});

app.post("/campgrounds/:id/comments", function(req, res){
	//Lookup campground using ID
	Campground.findById(req.params.id, function(err, campground){
		if(err){
		console.log(err);
		res.redirect("/campground");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err) {
					console.log(err);
				} else {
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/"+campground._id);
				}
			});
		}
	});
	//Create new comments
	// Connect new comment to campground
	////Redirect campground show page
});


app.listen(3000, function(){
	console.log("The YelpCamp Server has started");
});