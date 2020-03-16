exports.run = (client, message, args, Discord) => {
    if (!args.length) {
        return client.commandHelp(message);
    }

    message.channel
        .send(
            new Discord.MessageEmbed()
                .setColor(message.color)
                .setTitle("Poll:")
                .setDescription(args.join(" "))
                .setFooter(`From ${message.authorDisplayName}`)
        )
        .then((msg) => {
            msg.react("✅");
            msg.react("❎");
            message.delete({
                timeout: 1000
            });
        })
        .catch((e) => {
            console.error(e);
        });
};

exports.meta = {
    operatorOnly: false,
    name: "poll",
    usage: `${process.env.PREFIX || "!"}poll <question>`,
    description: "Starts a poll for input question"
};
