module.exports = (client, message, Discord) => {
    if (message.author.bot || message.channel.type === "dm") {
        return;
    }

    if (
        message.channel.id === process.env.SHOWCASECHANNEL &&
        !message.attachments.size &&
        !message.content.match("(https?:\\/\\/[^\\s]+)")
    ) {
        return;
    }

    client.sendLog(
        new Discord.MessageEmbed()
            .setColor(message.color)
            .setAuthor(message.authorName, message.author.avatarURL({ size: 2048 }))
            .setTitle("Message Deleted")
            .setDescription(message.content)
            .addField("Channel", message.channel)
            .setFooter(new Date())
    );
};
