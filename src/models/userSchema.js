const mongoose = require("mongoose");

module.exports = mongoose.model(
    "UserProfile",
    mongoose.Schema({
        id: String,
        guild: String,
        profile: {
            git: String,
            dotfiles: String,
            description: String,
        },
    })
);
