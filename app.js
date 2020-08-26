var express        = require("express");
var app            = express();
var bodyParser     = require("body-parser");
var mongoose       = require("mongoose");
var Campground     = require("./models/campground");
var Comment        = require("./models/comment");
var seedDB         = require("./seeds");
var passport       = require("passport");
var LocalStrategy  = require("passport-local");
var User           = require("./models/user");
var methodOverride = require("method-override"); 

// REQUIRING ROUTES
var commentRoutes    = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes       = require("./routes/index");


mongoose.connect("mongodb://localhost/yelp_camp"); //This will create a database inside mongoDB
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));  //dirname refers to the directry the script lives in
app.use(methodOverride("_method"));
// seedDB(); // Seed the database


// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "This is created by Arihant",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//MiddleWare Function that will run for every route
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes); //This will append /campgrounds to all the campground routes
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(3000, function(){
	console.log("The YelpCamp Server has started");
});