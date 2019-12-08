var mongoose = require("mongoose");

var alumniSchema = new mongoose.Schema({
    name: String,
    branch: String,
    batch: String,
    college: String,
    image: String,
    location: String
});


module.exports = mongoose.model("Alumni", alumniSchema);