module.exports = (client, log, Discord) => {
    client.channels.cache
        .get(client.settings.verboseChannel)
        .send(
            new Discord.MessageEmbed()
                .setColor("#FFFFFE")
                .setDescription(
                    "```js\n" + log.toString().substring(0, 2039) + "```"
                )
        );
};
