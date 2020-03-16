module.exports = async (client, message, Discord) => {
    if (message.author.bot || message.channel.type !== "text") {
        return;
    }

    if (message.channel.id === client.settings.showcaseChannel) {
        return client.showcase(client, message);
    }

    if (client.settings.userScore.enable) {
        client.handleMessageScore(message);
    }
    const prefix = process.env.PREFIX || "!";

    let msg = message.content.split(" "),
        args = msg.slice(1),
        cmd = msg[0].toLowerCase().substring(prefix.length);

    if (args[0] === "help") {
        return client.commandHelp(message);
    }

    if (
        message.content.startsWith(prefix + cmd) &&
        (command = client.commands.get(cmd))
    ) {
        if (
            !command.meta.operatorOnly ||
            message.member.hasPermission("MANAGE_GUILD")
        ) {
            command.run(client, message, args, Discord);
        }
    }
};
