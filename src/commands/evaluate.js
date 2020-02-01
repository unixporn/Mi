exports.run = async (client, message, args, Discord) => {
    if (message.author.id !== process.env.HOSTID) {
        return message.channel.embed(
            `**${message.authorName}**, this is only available to the host`
        );
    }

    if (!args.length) {
        return message.channel.embed(
            `**${message.authorName}**, missing input`
        );
    }

    if (message.content.toLowerCase().includes("token")) {
        return message.channel.embed(
            `**${message.authorName}**, at risk of token leak, returned`
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
    usage: "e",
    description: "Executes input Javascript"
};
