var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    LocalStrategy = require("passport-local"),
    passport = require("passport"),
    User = require("./models/user"),
    Alumni = require("./models/alumni");



mongoose.connect("mongodb://localhost:27017/alumni_connects", { useUnifiedTopology: true, useNewUrlParser: true }); //create yelpcamp db inside mongodb

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");


///////////////////////////////////////////////////////////////////////////
// Passport setup 
app.use(require('express-session')({
    secret: "Once again rusty wins the cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});
////////////////////////////////////////////////////////////////////

app.get("/", function(req, res) {
    res.render("landing");
});

//INDEX ROUTE - show all alumnis
app.get("/alumni", function(req, res) {
    // Get all alumnis from DB
    Alumni.find({}, function(err, allalumni) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {
                alumni: allalumni
            }); //data + name passing in
        }
    });

});

app.post("/search", function(req, res) {

    var alumni = req.body;
    console.log(alumni);

    var query, query2;
    var name, batch;

    if (req.body.name) {
        query = req.body.name;
    } else {
        query = { name: { $exists: true } };
    }

    if (req.body.batch) {
        query2 = req.body.batch;
    } else {
        query2 = { batch: { $exists: true } };
    }
    var college = req.body.college;

    Alumni.find({ name: query, batch: query2, college: college }, function(err, alumni) {

        if (err) {
            console.log("OOPS there's an error");

        } else {

            res.render("index.ejs", { alumni: alumni });
        }

    });

    // Alumni.find({ title: { $regex: new RegExp(title1) } }, function(err, blog) {
    // if (err) {
    //     console.log("OOPS there's an error");

    // } else {
    //     res.render("index.ejs", { blog: blog });
    // }
    // });

    //  db.products.find( { sku: { $regex: /789$/ } } )


});


//CREATE - add new campgrounds to database
app.post("/alumni", function(req, res) {
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var branch = req.body.branch;
    var batch = req.body.batch;
    var college = req.body.college;
    var location = req.body.location;

    var newAlumni = {
        name: name,
        image: image,
        branch: branch,
        batch: batch,
        location: location,
        college: college

    };

    //create a new campground and save to db
    Alumni.create(newAlumni, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            // redirect back to campgrounds page
            res.redirect("/alumni"); //
        }
    });
});


//NEW - show form to create new campground 
app.get("/alumni/new", function(req, res) {
    res.render("new.ejs")
});

//SHOW - shows more info about campground selected - to be declared after NEW to not overwrite
app.get("/alumni/:id", function(req, res) {
    //find the campground with the provided ID
    Alumni.findById(req.params.id, function(err, foundalumni) {
        if (err) {
            console.log(err);
        } else {
            //render show template with that campground
            res.render("show", {
                alumni: foundalumni
            });
        }
    });
});

//======================================================
//AUTH ROUTES
//=======================================================

app.get("/register", function(req, res) {
    res.render("register");

});

//Handle user sign up
app.post("/register", function(req, res) {

    var newuser = new User({ username: req.body.username });

    User.register(newuser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("register");

        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/alumni");

        });

    });


});

//LOGIN routes

app.get("/login", function(req, res) {
    res.render("login");

});

//HAndle login page
app.post("/login", passport.authenticate("local", {
    successRedirect: "/alumni",
    failureRedirect: "/login"

}), function(req, res) {

});

//LOGOUT ROUTE
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/alumni");
})


//Is login check for adding comments
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}



app.listen(3000, function() {
    console.log(" Jai shree ram Alumni server has started!");
});