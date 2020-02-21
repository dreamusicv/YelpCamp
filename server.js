let express = require("express");
let flash = require("connect-flash");
let session = require("express-session");
let mongoose = require("mongoose");
let passport = require("passport");
let bodyParser = require("body-parser");
let LocalStrategy = require("passport-local");
let methodOverride = require("method-override");

// var Camp = require("./models/camp");
var User = require("./models/user");
// var seedDB = require("./seeds");
// var Comment = require("./models/comment");

var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments"),
    authRoutes = require("./routes/index");

var app = express();

var sessionObj = {
    secret: "You shouldn't know this!",
    resave: false,
    saveUninitialized: false
}

app.set("view engine", "ejs");
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

app.use(bodyParser.urlencoded({ extended: true }));
// eslint-disable-next-line no-undef
app.use(express.static(__dirname + "/public"));

app.use(session(sessionObj));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", authRoutes);

mongoose.connect("mongodb://localhost:27017/yelpcamp");

// Set some default info. into the DB
// seedDB();

app.listen(3000, () => {
    console.log("YelpCamp running on port 3000");
})

