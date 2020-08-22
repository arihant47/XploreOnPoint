var express    = require("express");
var router     = express.Router({mergeParams: true});//This will merge the params of campground & comments together
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// ***************    COMMENTS  ROUTES    *****************

//Comments new
router.get("/new", isLoggedIn, function(req, res){  //isLoggedIn is the middleware function
	//Find campground by id
	Campground.findById(req.params.id, function(err, campground){
		if(err) {
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});	
});

//Comments create
router.post("/", isLoggedIn, function(req, res){
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
});

//Middleware function
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;
