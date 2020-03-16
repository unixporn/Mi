const mongoose = require("mongoose");

module.exports = mongoose.model(
    "UserProfile",
    mongoose.Schema({
        id: String,
        guild: String,
        profile: {
            git: String,
            dotfiles: String,
            description: String
        },
        lastSentRep: Date,
        score: require("mongoose-float").loadType(mongoose, 6),
        repHistory: Array
    })
);
