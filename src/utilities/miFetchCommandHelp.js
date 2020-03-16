const Discord = require("discord.js");
module.exports = (client, message) => {
    const name = message.content
        .split(" ")[0]
        .toLowerCase()
        .substring((process.env.PREFIX || "!").length);

    if (!(command = client.commands.get(name))) {
        throw new RangeError(`"${name}" is not a command.`);
    }

    return message.channel.send(
        new Discord.MessageEmbed()
            .setColor(message.color)
            .addField(
                command.meta.description.toTitleCase(),
                `\`\`\`${command.meta.usage}\`\`\``
            )
    );
};
