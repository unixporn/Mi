exports.run = (client, message, args, Discord) => {
    if (args.length && client.commands.get(args.join(" "))) {
        return message.channel.send(
            client
                .commandHelp(args.join(" "))
                .setColor(message.color)
                .setTitle("Usage:")
        );
    }

    const embed = new Discord.MessageEmbed()
        .setColor(message.color)
        .setTitle(`Commands for **${client.user.username}**`);

    Array.from(
        new Set(client.commands.filter((c) => !c.meta.operatorOnly).array())
    ).forEach((c) =>
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
    operatorOnly: false,
    name: "bot help",
    usage: `${process.env.PREFIX || "!"}help or ${process.env.PREFIX ||
        "!"}help <command>`,
    description: "You are here"
};
