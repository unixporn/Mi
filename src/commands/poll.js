exports.run = async (client, message, args, Discord) => {
    if (!args.length) {
        return message.channel.send(
            client
                .commandHelp("poll")
                .setColor(message.color)
                .setTitle("Usage:")
        );
    }

    message.channel
        .send(
            new Discord.MessageEmbed()
                .setColor(message.color)
                .setTitle("Poll:")
                .setDescription(args.join(" "))
                .setFooter(`From ${message.authorName}`)
        )
        .then((msg) => {
            msg.react("✅");
            msg.react("❎");
            message.delete({
                timeout: 1000
            });
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.meta = {
    operatorOnly: false,
    name: "poll",
    usage: `${process.env.PREFIX || "!"}poll <question>`,
    description: "Starts a poll for input question"
};
