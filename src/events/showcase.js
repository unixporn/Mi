module.exports = (client, message, Discord) => {
    if (!message.attachments.size && !message.content.match("(https?:\\/\\/[^\\s]+)")) {
        try {
            message.delete();
            message.author.send(
                new Discord.MessageEmbed()
                    .setColor("#FFFFFE")
                    .setDescription(
                        `
**${message.channel}** is for showcasing your creations (rices, applications, creative work).
**Questions** about ricing belong in ${message.guild.channels.get(process.env.RICINGCHANNEL)}.`
                    )
                    .addField("You said", message.content.substring(0, 512))
            );
        } catch (error) {
            console.error(error);
        } finally {
            client.sendLog(
                new Discord.MessageEmbed()
                    .setColor(message.color)
                    .setAuthor(message.authorName, message.author.avatarURL({ size: 2048 }))
                    .setTitle("Improper Showcase Submission")
                    .setDescription(message.content)
                    .addField("Channel", message.channel)
                    .setFooter(new Date())
            );
        }
    }
};
