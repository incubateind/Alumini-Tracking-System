var mongoose = require("mongoose");

var alumniSchema = new mongoose.Schema({
    name: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    branch: String,
    batch: String,
    college: String,
    image: String,
    location: String,
    mobile: String,
    email: String
});


module.exports = mongoose.model("Alumni", alumniSchema);