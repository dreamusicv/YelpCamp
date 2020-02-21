var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
/* AUTH ROUTES */
router.get("/", (req, res) => {
    res.render("landing");
})

// REGISTER ROUTES
router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", (req, res) => {
    User.register(new User({username: req.body.username}), req.body.password, (err, user) =>{
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome, " + user.username)
            res.redirect("/campgrounds");
        })
    })
})

//LOGIN ROUTES
router.get("/login", (req, res) => {

    res.render("login");
});

router.post("/login", (req, res, next) => { 
    passport.authenticate("local", (err, user, info) => {
        if(err){
            // req.session.error = err;
            req.flash("error", err.message);
            res.redirect("/login");
        }
        else if(!user) {
            // req.session.error = info;
            req.flash("error", info.message);
            res.redirect("/login");
        }
        else{
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                // req.session.error = null;
                req.flash("success", "Welcome, " + user.username);
                res.redirect("/campgrounds");
            });
            // console.log(req.isAuthenticated());
        }
    })(req, res, next);
});

/* SHORT VERSION OF LOGIN ROUTE */
// router.post("/login", passport.authenticate("local", {
//     successRedirect: "/campgrounds",
//     failureRedirect: "/login"
// }), function(req, res) {

// });

// LOGOUT ROUTE
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "You have logged out!");
    res.redirect("/campgrounds");
});


module.exports = router;