const handleDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
};

exports.run = async (client, message, args, Discord) => {
    message.channel.send(
        new Discord.MessageEmbed()
            .setTitle(`Info for **${message.guild.name}**`)
            .setColor(message.color)
            .setThumbnail(message.guild.iconURL())
            .addField("Owner", message.guild.owner.user, true)
            .addField("Voice Region", message.guild.region, true)
            .addField("Channels", message.guild.channels.cache.size, true)
            .addField("Members", message.guild.memberCount, true)
            .addField(
                "Bots",

                message.guild.members.cache.filter((m) => m.user.bot).size,

                true
            )
            .addField(
                "Online",

                message.guild.members.cache.filter(
                    (member) => member.user.presence.status !== "offline"
                ).size,
                true
            )
            .addField(
                "Server Created",
                handleDate(message.guild.createdAt),
                true
            )
            .addField(
                "Roles",
                message.guild.roles.cache
                    .sort((a, b) => a.position - b.position)
                    .map((r) => r)
                    .reverse()
                    .toString()
                    .split(",")
                    .join(" ")
            )
    );
};

exports.meta = {
    operatorOnly: false,
    name: "server info",
    usage: `${process.env.PREFIX || "!"}serverinfo`,
    description: "Information about the current server"
};
