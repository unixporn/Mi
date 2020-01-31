const mongoose = require("mongoose");

module.exports = mongoose.model(
    "ColorRoles",
    mongoose.Schema({
        id: String,
        colorRoles: Array
    })
);
