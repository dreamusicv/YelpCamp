let express = require("express");
let router = express.Router();
let Camp = require("../models/camp")
let Comment = require("../models/comment");
let middleware = require("../middleware");
// CAMPGROUNDS
// INDEX ROUTE
router.get("/", (req, res) => {
    Camp.find({}, (err, campgrounds) => {
        if (err) {
            console.log("Error: " + err.message);
            req.flash("error", "Failed to load resources");
            res.redirect("/");
        }
        else {
            res.render("campgrounds/index", { campgrounds });
        }
    })

})

// CREATE ROUTE
router.post("/", middleware.isLoggedIn, (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {id: req.user._id, username: req.user.username};

    var newCamp = {
        name: name,
        image: image,
        description: description,
        author: author
    };

    // campgrounds.push({ name: name, image: image });
    Camp.create(newCamp, (err, camp) => {
        if (err) {
            console.log("Error: " + err);
            req.flash("error", err.message)
            res.send("Failed to add camp");
        }
        else {
            req.flash("success", "Successfully created camp!");
            res.redirect("/campgrounds");
        }
    });

    // res.redirect("/campgrounds");
    // res.send("post route from compgrounds");
})


// NEW ROUTE
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

// SHOW ROUTE
router.get("/:id", (req, res) => {
    var id = req.params.id;

    // Camp.findById(id).populate("comments").exec((err, camp) => {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         res.render("campgrounds/show", { camp });
    //     }
    // });

    Camp.findById(id).populate("comments").then((camp) => {
        if(camp){
            return res.render("campgrounds/show", { camp });
        }
        req.flash("error", "Non existent campground.");
        res.redirect("/campgrounds");
    }).catch((err) => {
        console.log(err);
        // req.flash("error", err.message);
        req.flash("error", "There was a problem getting this camp.")
        res.redirect("/campgrounds");
    });

});

// EDIT ROUTES
router.put("/:id", (req, res) => {
    Camp.findByIdAndUpdate(req.params.id, req.body.blog).then((updatedCamp)=>{
        console.log(updatedCamp);
        req.flash("success", "Camp updated successfully.");
        res.redirect("/campgrounds/"+req.params.id);
    })
    .catch((err) => {
        console.log(err);
        req.flash("error", err.message);
        res.redirect("/campgrounds");
    })
});

router.get("/:id/edit", middleware.checkCampOwnership, (req, res) => {
    var id = req.params.id;
    Camp.findById(id).then((camp) => {
        if(camp){
            return res.render("campgrounds/edit", { camp });
        }
        req.flash("error", "Non existent campground.");
        res.redirect("/campgrounds");
    }).catch((err) => {
        // req.flash("error", err.message);
        req.flash("error", "There was a problem getting this camp.")
        res.redirect("/campgrounds");
        console.log("Error in get edit" + err);
    });
});

// DELETE ROUTES
router.delete("/:id", middleware.isLoggedIn, (req, res) => {
    var id = req.params.id;
    Camp.findByIdAndDelete(id).then((camp) =>{
        console.log(camp.name + " successfully deleted");
        req.flash("success", camp.name + " successfully deleted")
        res.redirect("/campgrounds");
        // Delete all the comments associated with the camp. 
        camp.comments.forEach((commentId) => {
            Comment.findByIdAndDelete(commentId).then((comment) =>{
                console.log(comment.text);
                console.log("Comment deleted!");
            })
            .catch((err) => {
                console.log("Error deleting comment!");
                console.log(err);
            })
        });
    })
    .catch((err) => {
        console.log("Error deleting item");
        console.log(err);
        req.res("error", err.message);
        res.redirect("/campgrounds");
    })
});


module.exports = router;