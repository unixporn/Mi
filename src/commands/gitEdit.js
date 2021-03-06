exports.run = async (client, message, args, Discord) => {
    if (!args.length) {
        return client.commandHelp(message);
    }

    client.UserSchema.findOne(
        {
            id: message.author.id,
            guild: message.guild.id
        },
        async (error, config) => {
            if (error) {
                return console.error(error);
            }

            if (!config) {
                config = new client.UserSchema(
                    Object.assign(client.settings.UserSchema.default, {
                        id: message.author.id,
                        guild: message.guild.id
                    })
                )
                    .save()
                    .catch((e) => console.error(e));
            }

            if (
                args.length &&
                ["clear", "remove"].includes(args[0].toLowerCase())
            ) {
                if (!config.profile.git) {
                    return message.channel.embed(
                        `**${message.authorDisplayName}**, nothing to remove`
                    );
                }

                message.channel.embed(
                    `**${message.authorDisplayName}**, are you sure you want to clear your profile git?`,
                    {
                        footer: "yes / no"
                    }
                );

                try {
                    var response = await message.channel.awaitMessages(
                        (m) =>
                            ["yes", "y", "no", "n"].includes(
                                m.content.toLowerCase()
                            ) && m.author === message.author,
                        {
                            max: 1,
                            time: client.settings.confirmDialogues.timeout,
                            errors: ["time"]
                        }
                    );
                } catch (err) {
                    return message.channel.embed(
                        `**${message.authorDisplayName}**, cancelled selection, missing or invalid input`
                    );
                }
                response = response.first().content.toLowerCase();

                if (["no", "n"].includes(response)) {
                    return message.channel.embed(
                        `**${message.authorDisplayName}**, cancelled operation`
                    );
                }

                config.profile.git = "";

                message.channel.embed(
                    `Removed **git** from user **${message.author}**`
                );
            } else if (args.length) {
                if (args[0].match("(https?:\\/\\/[^\\s]+)")) {
                    if (args[0].length <= 128) {
                        config.profile.git = args[0];

                        message.channel.embed(
                            `Set **git** of user **${message.author}** to **${config.profile.git}**`
                        );
                    } else {
                        return message.channel.embed(
                            `**${message.authorDisplayName}**, maximum length 128 characters`
                        );
                    }
                } else {
                    return message.channel.embed(
                        `**${message.authorDisplayName}**, *${args[0]}* is not a valid URL`
                    );
                }
            } else {
                client.commandHelp(message);
            }

            config.save().catch((e) => console.error(e));
        }
    );
};

exports.meta = {
    operatorOnly: false,
    name: "user set git",
    usage: `${process.env.PREFIX || "!"}setgit <url>`,
    description: "Set Git link on your profile"
};
