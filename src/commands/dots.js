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

            if (
                args[0] &&
                ["clear", "remove"].includes(args[0].toLowerCase())
            ) {
                if (!config.profile.dotfiles) {
                    return message.channel.embed(
                        `**${message.authorName}**, nothing to remove`
                    );
                }

                message.channel.embed(
                    `**${message.authorName}**, are you sure you want to clear your profile dotfiles?`,
                    { footer: "yes / no" }
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

                config.profile.dotfiles = "";

                message.channel.embed(
                    `Removed **dotfiles** from **${message.author}**`
                );
            } else if (args.length) {
                if (args[0].match("(https?:\\/\\/[^\\s]+)")) {
                    if (args[0].length <= 128) {
                        config.profile.dotfiles = args[0];

                        message.channel.embed(
                            `Set **dotfiles** of **${message.author}** to **${config.profile.dotfiles}**`
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
                    config.profile.dotfiles
                        ? `**Dotfiles** for ${message.author} **${config.profile.dotfiles}**`
                        : `**${message.authorName}**, use \`${process.env
                              .PREFIX || "!"}dots <url>\``
                );
            }

            config.save().catch((e) => console.error(e));
        }
    );
};

exports.meta = {
    operatorOnly: false,
    name: "user dots",
    usage: "dots <url>",
    description: "Adds dotfiles link to your profile"
};
