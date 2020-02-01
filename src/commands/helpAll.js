exports.run = (client, message, args, Discord) => {
    const embed = new Discord.MessageEmbed()
        .setColor(message.color)
        .setTitle(`Commands for **${client.user.username}**`);

    Array.from(new Set(client.commands.array())).forEach((c) =>
        embed.addField(
            c.meta.name.toTitleCase(),
            `\`${process.env.PREFIX || "!"}${c.meta.usage}\`\n${
                c.meta.description
            }`
        )
    );

    message.channel.send(embed);
};

exports.meta = {
    operatorOnly: true,
    name: "bot help all",
    usage: "allhelp",
    description: "You are here"
};
