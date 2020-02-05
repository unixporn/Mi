exports.run = async (client, message, args, Discord) => {
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
                config = new client.UserSchema({
                    id: message.author.id,
                    guild: message.guild.id,
                    profile: {
                        git: "",
                        dotfiles: "",
                        description: ""
                    }
                })
                    .save()
                    .catch((e) => console.error(e));
            }

            if (
                args.length &&
                ["clear", "remove"].includes(args[0].toLowerCase())
            ) {
                if (!config.profile.git) {
                    return message.channel.embed(
                        `**${message.authorName}**, nothing to remove`
                    );
                }

                message.channel.embed(
                    `**${message.authorName}**, are you sure you want to clear your profile git?`,
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
                            time: 10000,
                            errors: ["time"]
                        }
                    );
                } catch (err) {
                    return message.channel.embed(
                        `**${message.authorName}**, cancelled selection, missing or invalid input`
                    );
                }
                response = response.first().content.toLowerCase();

                if (["no", "n"].includes(response)) {
                    return message.channel.embed(
                        `**${message.authorName}**, cancelled operation`
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
                            `**${message.authorName}**, maximum length 128 characters`
                        );
                    }
                } else {
                    return message.channel.embed(
                        `**${message.authorName}**, \`${args[0]}\` is not a valid URL`
                    );
                }
            } else {
                return message.channel.embed(
                    config.profile.git
                        ? `**Git** for ${message.author} **${config.profile.git}**`
                        : `**${message.authorName}**, use \`${process.env
                              .PREFIX || "!"}git <url>\``
                );
            }

            config.save().catch((e) => console.error(e));
        }
    );
};

exports.meta = {
    operatorOnly: false,
    name: "user git",
    usage: "git <url>",
    description: "Adds git link to your profile"
};
