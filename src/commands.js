const Discord = require("discord.js");

module.exports = new Discord.Collection()
    .set("e", require("./commands/evaluate.js"))

    .set("pfp", require("./commands/avatar.js"))
    .set("avatar", require("./commands/avatar.js"))
    .set("avy", require("./commands/avatar.js"))

    .set("roles", require("./commands/roleList.js"))
    .set("l", require("./commands/roleList.js"))
    .set("list", require("./commands/roleList.js"))
    .set("colors", require("./commands/roleList.js"))
    .set("colours", require("./commands/roleList.js"))
    .set("rolelist", require("./commands/roleList.js"))
    .set("listroles", require("./commands/roleList.js"))

    .set("setrole", require("./commands/roleListEdit.js"))

    .set("role", require("./commands/roleGet.js"))
    .set("r", require("./commands/roleGet.js"))
    .set("color", require("./commands/roleGet.js"))
    .set("colour", require("./commands/roleGet.js"))
    .set("addrole", require("./commands/roleGet.js"))

    .set("d", require("./commands/dotsView.js"))
    .set("dots", require("./commands/dotsView.js"))
    .set("dotfiles", require("./commands/dotsView.js"))

    .set("setdots", require("./commands/dotsEdit.js"))
    .set("setdotfiles", require("./commands/dotsEdit.js"))

    .set("git", require("./commands/gitView.js"))

    .set("setgit", require("./commands/gitEdit.js"))

    .set("rep", require("./commands/userRep.js"))
    .set("thanks", require("./commands/userRep.js"))

    .set("desc", require("./commands/descriptionEdit.js"))
    .set("description", require("./commands/descriptionEdit.js"))
    .set("setdesc", require("./commands/descriptionEdit.js"))
    .set("setdescription", require("./commands/descriptionEdit.js"))
    .set("editdesc", require("./commands/descriptionEdit.js"))
    .set("editdescription", require("./commands/descriptionEdit.js"))

    .set("profile", require("./commands/userInfo.js"))
    .set("userinfo", require("./commands/userInfo.js"))

    .set("help", require("./commands/help.js"))

    .set("poll", require("./commands/poll.js"))

    .set("clear", require("./commands/clear.js"))
    .set("purge", require("./commands/clear.js"))

    .set("serverinfo", require("./commands/guildInfo.js"))
    .set("guildinfo", require("./commands/guildInfo.js"))
    .set("server", require("./commands/guildInfo.js"))

    .set("editscore", require("./commands/scoreEdit.js"))

    .set("score", require("./commands/scoreView.js"));
