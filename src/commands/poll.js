exports.run = (client, message, args, Discord) => {
    if (!args.length) {
        return client.commandHelp(message);
    }

    let array = args
            .join(" ")
            .toLowerCase()
            .split("or")
            .filter(i => i.length > 1),
        iter,
        desc = "",
        reactions = [
            "🇦",
            "🇧",
            "🇨",
            "🇩",
            "🇪",
            "🇫",
            "🇬",
            "🇭",
            "🇮",
            "🇯",
        ];

    if (array.length > 10) {
        return message.channel.embed(
            "Maximum of 10 arguments"
        );
    }

    for (iter = 0; array[iter]; iter++) {
        desc += `${reactions[iter]}: ${array[iter]}\n`;
    }

    message.channel
        .send(
            new Discord.MessageEmbed()
                .setTitle("Poll")
                .setColor(message.color)
                .setFooter(
                    `From @${message.authorDisplayName}`
                )
                .setDescription(desc)
        )
        .then(m => {
            for (
                iter = 0;
                iter <= array.length - 1;
                iter++
            ) {
                m.react(reactions[iter]);
            }
        });
};

exports.meta = {
    operatorOnly: false,
    name: "poll",
    usage: `${
        process.env.PREFIX || "!"
    }poll <choice> or <choice> or <choice>`,
    description:
        "Starts a poll with options separated by 'or'",
};
