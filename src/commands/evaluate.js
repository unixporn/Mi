exports.run = async (client, message, args, Discord) => {
    if (message.author.id !== process.env.HOSTID) {
        return message.channel.embed(
            `**${message.authorDisplayName}**, this is only available to the host`
        );
    }

    if (!args.length) {
        return message.channel.send(
            client
                .commandHelp("e")
                .setColor(message.color)
                .setTitle("Usage:")
        );
    }

    if (message.content.toLowerCase().includes("token")) {
        return message.channel.embed(
            `**${message.authorDisplayName}**, at risk of token leak, returned`
        );
    }

    let embed = new Discord.MessageEmbed().setColor(message.color);

    try {
        embed.setDescription(
            "```js\n" +
                require("util")
                    .inspect(eval(args.join(" ")))
                    .substring(0, 2000)
                    //Globally, ignorant of case, redact bot token
                    .replace(RegExp(process.env.TOKEN, "gi"), "TOKEN") +
                "```"
        );
    } catch (error) {
        embed.setDescription("```js\n" + error + "```");
    } finally {
        message.channel.send(embed);
    }
};

exports.meta = {
    permissions: { bot: ["SEND_MESSAGES"], user: [] },
    operatorOnly: true,
    name: "evaluate",
    usage: `${process.env.PREFIX || "!"}e <javascript>`,
    description: "Executes input Javascript"
};
