module.exports = async (client, message) => {
    let str = message.content,
        score;

    if (
        client.settings.userScore.decrementWords.some((i) =>
            str.toLowerCase().includes(i)
        )
    ) {
        score = client.settings.userScore.penalty;
    } else {
        const mentionRegex = /<@!?(\d*)>/g,
            emoteRegex = /<(a?):(.+?):(\d+)>/g,
            channelRegex = /<#!?(\d*)>/g;

        let mentionMatch = mentionRegex.exec(str),
            channelMatch = channelRegex.exec(str),
            emoteMatch = emoteRegex.exec(str);

        while (mentionMatch || channelMatch || emoteMatch) {
            str = str
                .replace(mentionRegex, "")
                .replace(channelRegex, "")
                .replace(emoteRegex, "");

            mentionMatch = mentionRegex.exec(str);
            channelMatch = channelRegex.exec(str);
            emoteMatch = emoteRegex.exec(str);
        }

        score =
            str
                .replace(/ /g, "")
                .substring(0, client.settings.userScore.lengthCap).length /
            client.settings.userScore.lengthFactor;
    }

    client.UserSchema.findOne(
        {
            id: message.author.id,
            guild: message.guild.id
        },
        (error, config) => {
            if (error) {
                return console.error(error);
            }

            if (!config) {
                config = new client.UserSchema(
                    Object.assign(client.settings.UserSchema.default, {
                        id: message.author.id,
                        guild: message.guild.id
                    })
                );
            }

            config.score += score;

            config.save().catch((e) => console.error(e));
        }
    );
};
