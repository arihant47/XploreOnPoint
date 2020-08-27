var express    = require("express");
var router     = express.Router({mergeParams: true});//This will merge the params of campground & comments together
var Campground = require("../models/campground");
var Comment    = require("../models/comment");
var middleware = require("../middleware/index.js"); //It will also wordk if you don't write /index.js

// ***************    COMMENTS  ROUTES    *****************

//Comments new
router.get("/new", middleware.isLoggedIn, function(req, res){  //isLoggedIn is the middleware function
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
router.post("/", middleware.isLoggedIn, function(req, res){
	//Lookup campground using ID
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			req.flash("error", "Something went wrong");
			console.log(err);
			res.redirect("/campground");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err) {
					console.log(err);
				} else {
					//Add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//Save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					console.log(comment);
					req.flash("success", "Successfully added comment");
					res.redirect("/campgrounds/"+campground._id);
				}
			});
		}
	});
});

//Comment Edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "No campground found");
			return res.redirect("back");
		}
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err) {
				res.render("back");
			} else {
				res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
			}
		});	
	});	
});

//Comments Update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err) {
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

//Comment Destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err) {
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted!");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

module.exports = router;
