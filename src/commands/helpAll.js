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

    Array.from(new Set(client.commands.array())).forEach((c) =>
        embed.addField(
            c.meta.name.toTitleCase(),
            `\`${c.meta.usage}\`\n${c.meta.description}`
        )
    );

    message.channel.send(embed);
};

exports.meta = {
    operatorOnly: true,
    name: "bot help all",
    usage: `${process.env.PREFIX || "!"}help or ${process.env.PREFIX ||
        "!"}help <command>`,
    description: "You are here"
};
