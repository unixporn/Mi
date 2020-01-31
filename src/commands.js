const Discord = require("discord.js");

module.exports = new Discord.Collection()
    .set("e", require("./commands/evaluate.js"))

    .set("pfp", require("./commands/avatar.js"))
    .set("avatar", require("./commands/avatar.js"))

    .set("l", require("./commands/roleList.js"))
    .set("list", require("./commands/roleList.js"))
    .set("roles", require("./commands/roleList.js"))
    .set("colors", require("./commands/roleList.js"))
    .set("colours", require("./commands/roleList.js"))

    .set("setrole", require("./commands/roleSet.js"))

    .set("r", require("./commands/roleGet.js"))
    .set("role", require("./commands/roleGet.js"))
    .set("color", require("./commands/roleGet.js"))
    .set("colour", require("./commands/roleGet.js"))
    .set("addrole", require("./commands/roleGet.js"))

    .set("d", require("./commands/dots.js"))
    .set("dots", require("./commands/dots.js"))
    .set("dotfiles", require("./commands/dots.js"))

    .set("git", require("./commands/git.js"))

    .set("desc", require("./commands/description.js"))
    .set("description", require("./commands/description.js"))

    .set("profile", require("./commands/profile.js"))

    .set("help", require("./commands/help.js"))

    .set("allhelp", require("./commands/helpAll.js"))

    .set("poll", require("./commands/poll.js"))

    .set("clear", require("./commands/clear.js"))
    .set("purge", require("./commands/clear.js"));
