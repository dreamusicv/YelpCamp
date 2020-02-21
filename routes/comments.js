let express = require("express");
let router = express.Router({ mergeParams: true });
let Camp = require("../models/camp");
let Comment = require("../models/comment");
let middleware = require("../middleware");
/* COMMENTS ROUTES */
// NEW ROUTE
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Camp.findById(req.params.id, (err, camp) => {
        if (err) {
            req.flash("error", err);
            res.redirect("/campgrounds");
        }
        else {
            res.render("comments/new", { camp });
        }
    })

})

router.post("/", middleware.isLoggedIn, (req, res) => {
    Camp.findById(req.params.id).then((camp) => {
        var comment = { author: { id: req.user._id, username: req.user.username }, text: req.body.comment.text };
        Comment.create(comment).then((comment) => {
            camp.comments.push(comment._id);
            camp.save();
            console.log("Comment saved!");
            req.flash("success", "Comment posted!");
            res.redirect("/campgrounds/" + camp._id);
        }).catch((err) => {
            console.log(err);
            req.flash("error", err);
            res.redirect("/campgrounds");
        })
    }).catch((err) => {
        console.log(err);
        req.flash("error", err);
        res.redirect("/campgrounds");
    })

});

// EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    let campId = req.params.id;
    Comment.findById(req.params.comment_id).then((comment) => {
        res.render("comments/edit", { comment, campId });
    }).catch((err) => {
        req.flash("error", err);
        res.redirect("back");
    })
});

// UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment).then((comment) => {
        console.log("Comment edited: " + comment.text);
        req.flash("success", "Comment succesfully edited!");
        res.redirect("/campgrounds/" + req.params.id);
    });
})

// DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndDelete(req.params.comment_id).then((deletedCom) => {

        Camp.findById(req.params.id).then((camp) => {
            for (let i = 0; i < camp.comments.length; i++) {
                if (camp.comments[i]._id.equals(deletedCom._id)) {
                    camp.comments.splice(i, 1);
                    camp.save();
                    console.log("Camp's comment deleted!");
                    break;
                }
            }
            console.log("Comment deleted: " + deletedCom.text);
            req.flash("success", "Comment succesfully deleted!");
            res.redirect("/campgrounds/" + req.params.id);
        })
    }).catch((err) => {
        console.log(err);
    });
})

module.exports = router;