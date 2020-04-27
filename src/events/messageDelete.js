module.exports = (client, message, Discord) => {
    if (
        message.author.bot ||
        message.channel.type === "dm"
    ) {
        return;
    }

    if (
        message.channel.id ===
            client.settings.showcaseChannel &&
        !message.attachments.size &&
        !message.content.match("(https?:\\/\\/[^\\s]+)")
    ) {
        return;
    }

    client.sendLog(
        new Discord.MessageEmbed()
            .setColor(message.color)
            .setAuthor(
                message.authorDisplayName,
                message.author.avatarURL({ size: 256 })
            )
            .setDescription(message.content)
            .setFooter(
                `Message deleted in #${message.channel.name}`
            )
    );
};
