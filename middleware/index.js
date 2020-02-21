let Camp = require("../models/camp");
let Comment = require("../models/comment");

let middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in in order to do that.");
    res.redirect("/login");
};

middlewareObj.checkCampOwnership = function(req, res, next) {
    var id = req.params.id;
    if (req.isAuthenticated()) {
        Camp.findById(id).then((camp) => {
            if(camp && camp.author.id.equals(req.user._id)){
                return next();
            }
            else{
                req.flash("error", "You don't have permission to edit this.");
                res.redirect("back");
            }
        }).catch((err) => {
            // req.flash("error", err.message);
            req.flash("error", "There was a problem getting this camp.")
            res.redirect("/campgrounds");
            console.log(err);
        });
    }
    else{
        req.flash("error", "You need to be logged in in order to do that.");
        res.redirect("/login");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    var id = req.params.comment_id;
    if (req.isAuthenticated()) {
        Comment.findById(id).then((comment) => {
            if(comment.author.id.equals(req.user._id)){
                return next();
            }
            else{
                req.flash("error", "You don't have permission to edit this.");
                res.redirect("back");
            }
        }).catch((err) => {
            req.flash("error", err.message);
            req.flash("error", "There was a problem getting this comment.")
            res.redirect("/campgrounds");
            console.log(err);
        });
    }
    else{
        req.flash("error", "You need to be logged in in order to do that.");
        res.redirect("/login");
    }
};

module.exports = middlewareObj;