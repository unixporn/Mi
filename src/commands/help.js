exports.run = (client, message, args, Discord) => {
    if (args.length && client.commands.get(args.join(" "))) {
        if (!client.commands.get(args.join(" "))) {
            throw new RangeError(`"${args.join(" ")}" is not a command.`);
        }

        return message.channel.send(
            new Discord.MessageEmbed()
                .setColor(message.color)
                .addField(
                    command.meta.description.toTitleCase(),
                    `\`\`\`${command.meta.usage}\`\`\``
                )
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
            `\`\`\`${c.meta.usage}\`\`\`\n${c.meta.description}`
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
