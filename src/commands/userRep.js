exports.run = (client, message, args, Discord) => {
    if (!args.length) {
        return client.commandHelp(message);
    }

    const user = message.fetchUser({
        notSelf: true
    });

    if (!user) {
        return message.channel.embed(
            `**${message.authorDisplayName}**, I couldn't find that user`
        );
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
                        id: user.id,
                        guild: message.guild.id
                    })
                );
            }

            if (
                Date.now() - config.lastSentRep <
                client.settings.userScore.timeout
            ) {
                return message.channel.embed(
                    `**${
                        message.authorDisplayName
                    }**, you can rep again in **${require("ms")(
                        client.settings.userScore.timeout -
                            (Date.now() - config.lastSentRep)
                    )}**.`
                );
            } else {
                client.UserSchema.findOne(
                    {
                        id: user.id,
                        guild: message.guild.id
                    },
                    (error, config) => {
                        if (error) {
                            return console.error(error);
                        }

                        if (!config) {
                            config = new client.UserSchema(
                                Object.assign(
                                    client.settings.UserSchema.default,
                                    {
                                        id: user.id,
                                        guild: message.guild.id
                                    }
                                )
                            );
                        }

                        let point, index;

                        if (
                            config.repHistory.find(
                                (i) => i.user === message.author.id
                            )
                        ) {
                            index = config.repHistory.find(
                                (i) => i.user === message.author.id
                            );

                            if (
                                index.reps >= client.settings.userScore.maxReps
                            ) {
                                return message.channel.embed(
                                    `**${message.authorDisplayName}**, you can rep users a maximum of **${client.settings.userScore.maxReps}** times.`
                                );
                            }
                            point =
                                client.settings.userScore.defaultPoint /
                                (client.settings.userScore
                                    .pointUndermineFactor *
                                    index.reps);

                            config.repHistory.find(
                                (i) => i.user === message.author.id
                            ).reps++;

                            config.markModified("repHistory");

                            config.score += point;

                            message.channel.embed(
                                `**${
                                    message.authorDisplayName
                                }**, you repped ${user}, their score is now **${Math.floor(
                                    config.score
                                )}**, this did something, even though you can't see it.`
                            );
                        } else {
                            point = 1;
                            index = config.repHistory.push({
                                user: message.author.id,
                                reps: 1
                            });
                            config.score++;

                            message.channel.embed(
                                `**${
                                    message.authorDisplayName
                                }**, you repped ${user}, their score is now **${Math.floor(
                                    config.score
                                )}**.`
                            );
                        }

                        config.save().catch((e) => console.error(e));
                    }
                );
            }

            config.lastSentRep = Date.now();

            config.save().catch((e) => console.error(e));
        }
    );
};

exports.meta = {
    operatorOnly: false,
    name: "user rep",
    usage: `${process.env.PREFIX || "!"}rep <@user>`,
    description: "Add or retract rep from user"
};
