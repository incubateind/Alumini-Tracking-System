var mongoose = require("mongoose");

var alumniSchema = new mongoose.Schema({
    name: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
        name: String
    },
    branch: String,
    batch: String,
    college: String,
    image: String,
    address: String,
    city: String,
    state: String,
    phone: String,
    country: String,
    mobile: String,
    email: String
});


module.exports = mongoose.model("Alumni", alumniSchema);