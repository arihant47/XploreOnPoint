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
var flash          = require("connect-flash");

// REQUIRING ROUTES
var commentRoutes    = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes       = require("./routes/index");


// mongoose.connect("mongodb://localhost/yelp_camp"); //This will create a database inside mongoDB
// mongoose.connect("MongoDB URI here", ... 
mongoose.connect("mongodb+srv://ArihantXXXX:Arihant2XXXB@cluster0.lkipt.mongodb.net/yelp_camp?retryWrites=true&w=majority", { 
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:', err.message);
});


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));  //dirname refers to the directry the script lives in
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); // Seed the database

app.locals.moment = require('moment');

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
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes); //This will append /campgrounds to all the campground routes
app.use("/campgrounds/:id/comments", commentRoutes);


// app.listen(3000, function(){
// 	console.log("The YelpCamp Server has started");
// });

//This is the listening port for heroku
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});
