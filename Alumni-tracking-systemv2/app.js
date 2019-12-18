var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    LocalStrategy = require("passport-local"),
    passport = require("passport"),
    User = require("./models/user"),
    Alumni = require("./models/alumni"),
    request = require('request'),
    nodemailer = require('nodemailer'),
    twilio = require('twilio');
var config = require('./config/config.js');
var client = new twilio(config.twilio.accountSid, config.twilio.authToken);



mongoose.connect("mongodb://localhost:27017/alumni_connects_v2", { useUnifiedTopology: true, useNewUrlParser: true }); //create alumni db inside mongodb

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.use(methodOverride("_method"));

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

// Alumni.remove({}, function(err) {
//     if (err) {
//         console.log(err);
//     }
// });

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

//////////////////////////////////
//SEARCH Alumni
//////////////////////////////
app.get("/alumni/search", function(req, res) {
    res.render("search.ejs");
});

app.post("/search", function(req, res) {

    var alumni = req.body;


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

    //console.log(college + " HEheh");
    // res.send("HI MAN THIS IS SEARCH");

    Alumni.find({ name: query, batch: query2, college: college }, function(err, alumni) {

        if (err) {
            console.log("OOPS there's an error");

        } else {

            alumni.forEach(function(alumni_) {
                // console.log(alumni_.name + " HAHA");
            });

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

//======================================================
//Send Email ROUTES
//=======================================================
app.get("/alumni/:id/email", function(req, res) {

    Alumni.findById(req.params.id, function(err, foundalumni) {
        if (err) {
            console.log(err);
        } else {
            //render show template with that campground
            console.log(foundalumni);
            res.render("email", {
                alumni: foundalumni
            });
        }
    });

    // res.render("email.ejs", { alumni: alumni });
});



app.post("/alumni/:id/email", function(req, res) {
    //res.render("email.ejs");

    // kVGf8EzjWNdVEAPZnaGKPEhf27eSqCdIEVOJQzgp
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.mlab.username,
            pass: config.mlab.password
        }
    });
    const string1 = req.params;
    var subject = req.body.Subject;
    var text = req.body.text;

    Alumni.findById(req.params.id, function(err, foundalumni) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/alumni/" + foundalumni._id);

            var string = 'kumaramankeshu@gmail.com' + ', ' + 'sonalranisr88@gmail.com';

            var mailOptions = {
                from: 'kumaramankeshu@gmail.com',
                to: foundalumni.email,
                subject: subject,
                text: text
                    // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'        
            };

            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
    });
});


//======================================================
//Send Message ROUTES
//======================================================
app.get("/alumni/:id/message", function(req, res) {
    Alumni.findById(req.params.id, function(err, foundalumni) {
        if (err) {
            console.log(err);
        } else {
            //render show template with that campground
            console.log(foundalumni);
            res.render("message", {
                alumni: foundalumni
            });
        }
    });

});
app.post("/alumni/:id/message", function(req, res) {


    var sender = '+12562428531';

    var message = req.body.text;
    // Details about Visitor $ { name }
    // Name: $ { name }
    // Email: $ { email }
    // Phone: $ { number }
    // Checkin Time: $ { currtime }
    // Visiting ID: $ { id }
    // `;

    Alumni.findById(req.params.id, function(err, foundalumni) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/alumni/" + foundalumni._id);
            receiver = foundalumni.mobile;
            client.messages.create({
                    to: receiver,
                    from: sender,
                    body: message
                })
                .then(message => console.log(`
                 SMS sent to Alumni: $ {  }
                ` + message.sid))
                .catch((error) => {
                    console.log(error);
                });

        }
    })

});
//CREATE - add new alumni to database
app.post("/alumni", isLoggedIn, function(req, res) {
    //get data from form and add to thriftstore array

    request('https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAPzLdcKEPCe4SQf3-cdSnq5vmh_MRaHCs' +

        '&address=' + encodeURIComponent(req.body.address),
        function(error, response, body) {
            if (error) {
                console.log('error!', error);
            } else {
                var data = JSON.parse(body);
                // console.log('data: ', util.inspect(data, { showHidden: false, depth: null }))

                if (data.results && data.results[0] && ["address_components"]) {
                    var addressComponents = data.results[0]["address_components"]
                    for (var i = 0; i < addressComponents.length; i++) {
                        if (
                            addressComponents[i]['types'].indexOf('sublocality_level_1') > -1 ||
                            addressComponents[i]['types'].indexOf('locality') > -1) {
                            var city = addressComponents[i]['long_name'];
                        }
                        if (addressComponents[i]['types'].indexOf('administrative_area_level_1') > -1) {
                            var state = addressComponents[i]['short_name'];
                        }
                        if (addressComponents[i]['types'].indexOf('country') > -1) {
                            var country = addressComponents[i]['long_name'];
                        }
                    }
                } else {
                    var city = null,
                        state = null,
                        country = null;
                }

                var newalumni = {
                    name: req.body.name,
                    image: req.body.image,
                    branch: req.body.branch,
                    batch: req.body.batch,
                    address: req.body.address,
                    college: req.body.college,
                    city: city,
                    state: state,
                    country: country,
                    mobile: req.body.mobile,
                    email: req.body.email,

                    author: {
                        id: req.user._id,
                        username: req.user.username,
                        name: req.user.name
                    }
                };


                Alumni.create(newalumni, function(err, newlyCreated) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(newlyCreated);
                        res.redirect("/alumni");
                    }
                });
            }

        });

});



//NEW - show form to create new campground 
app.get("/alumni/new", isLoggedIn, function(req, res) {
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
//EDIT ROUTES
//=======================================================
app.get("/alumni/:id/edit", checkAuthorization, function(req, res) {

    Alumni.findById(req.params.id, function(err, foundalumni) {
        if (err) {
            console.log(err);

        } else {
            res.render("alumni/edit", { alumni: foundalumni });
        }
    });

});



//======================================================
//UPDATE ROUTES
//=======================================================
app.put("/alumni/:id", checkAuthorization, function(req, res) {
    Alumni.findByIdAndUpdate(req.params.id, req.body.alumni, function(err, updatedalumni) {
        if (err) {
            res.redirect("/alumni");
        } else {
            res.redirect("/alumni/" + req.params.id);
        }
    });
});




//======================================================
//DESTROY ROUTE
//=======================================================
app.delete("/alumni/:id", checkAuthorization, function(req, res) {
    Alumni.findByIdAndRemove(req.params.id, function(err, newalumni) {
        if (err) {
            res.redirect("/alumni");

        } else {
            res.redirect("/alumni");
        }
    });
});

function checkAuthorization(req, res, next) {
    if (req.isAuthenticated()) {
        Alumni.findById(req.params.id, function(err, foundalumni) {
            if (err) {
                res.redirect("back");

            } else {


                if (foundalumni.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });

    } else {
        res.redirect("back");
    }
}

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