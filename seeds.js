var mongoose = require("mongoose"),
    Camp = require("./models/camp"),
    Comment = require("./models/comment");

var campgrounds = [
    {
        name: "Justice League",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTMgsUcqfdvKno-dhMGuyUwteUt-DukwSEYLdvjLXlGW4R1gUyI",
        description: "Superhero group of DC Comics",
    },
    {
        name: "Avengers",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSgWjwM-QR8_QDuJtUt1wXjuZO3tGtF1wivH6fmscCYQtAClaGr",
        description: "Superhero group of Marvel Comics",
    },
    {
        name: "Captain America",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTmqOVsQYwOl07zSaf2wkkx8B77xK2Q46eBf1Vj0lnZDP28dWMg",
        description: "Steve Rogers: America's Ass of Marvel Comics!",
    },
    {
        name: "Spider-Man",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTV8qvXxE6fIJWsywV9NFP7enRgRCN2eZXsB-8VSytHXBcdA1n9",
        description: "Peter Parker: A superheroe with spider powers from Marvel Comics",
    },
    {
        name: "Ironman",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRG_XLW6ixzhu8MmLUq3TZNY-yd-8bI5r9v5ocrMMLsKk8vl0Og",
        description: "Tony Stark: The genious, billionaire, playboy and philantropist from Marvel Comics",
    },
    {
        name: "The Sentry",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTcZtCYwzub1kXqucxCt-arPR8Sxxi92gn7X4y9qQQtC_BCF7DD",
        description: "Robert Reynolds: with the power of a million exploding suns",
    },
    {
        name: "Hyperion",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTQCckEDytYCqA4NDNH6VNZskMQk2I3tAyB8kWEk7hFd5pLz76U",
        description: "Marvel Comics' Superman?",
    },
    {
        name: "Superman",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRyGH1odoV4pqnbFH3nYg1wKz9M33yDgPdtUNqoQvWkgXX2hybQ",
        description: "Clark Kent: The OPman from DC Comics",
    },
    {
        name: "Batman",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRfUdYNT4e603eglB058p8VM597P1motOMA7K_GpydK4wRHfOZj",
        description: "Bruce Wayne: The genious, billionaire, playboy and philantropist from DC Comics",
    },
    {
        name: "The Flash",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQdcVVd2fGt_Sez7RrZHpIBnTDawb7klqLtTNbfKrDTYdYguLxz",
        description: "Barry Allen: The Fastest man alive from DC Comics",
    }
]

function seedDB() {
    Camp.deleteMany({}, (err, camps) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Data removed!");
            for (var i = 0; i < 4; i++) {
                Camp.create(campgrounds[Math.floor(Math.random() * 10)], (err, camp) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("Camp added");
                        Comment.create({
                            text: "This one is my favorite, and I don't say this about anyone!",
                            author: "Víctor"
                        }, (err, comment) => {
                            if (err) {
                                console.log(err);
                            }
                            else{
                                camp.comments.push(comment._id);
                                camp.save();
                                console.log("New comment added!");
                            }
                        })
                    }
                });
            }
        }
    });
}

module.exports = seedDB;
