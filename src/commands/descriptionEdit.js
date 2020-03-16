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

            if (["clear", "remove"].includes(args[0].toLowerCase())) {
                if (!config.profile.description) {
                    return message.channel.embed(
                        `**${message.authorDisplayName}**, nothing to remove.`
                    );
                }

                message.channel.embed(
                    `**${message.authorDisplayName}**, are you sure you want to clear your profile description?`,
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
                            time: client.settings.confirmDialogues.timeout,
                            errors: ["time"]
                        }
                    );
                } catch (err) {
                    return message.channel.embed(
                        `**${message.authorDisplayName}**, cancelled selection, missing or invalid input.`
                    );
                }
                response = response.first().content.toLowerCase();

                if (["no", "y"].includes(response)) {
                    return message.channel.embed(
                        `**${message.authorDisplayName}**, cancelled operation.`
                    );
                }

                config.profile.dotfiles = "";

                message.channel.embed(
                    `Removed **description** from user **${message.author}**.`
                );
            } else if (args) {
                if (args.join(" ").length <= 256) {
                    config.profile.description = args.join(" ");

                    message.channel.embed(
                        `Set **description** of user **${message.author}**.`
                    );
                } else {
                    return message.channel.embed(
                        `**${message.authorDisplayName}**, maximum length 256 characters.`
                    );
                }
            }

            config.save().catch((e) => console.error(e));
        }
    );
};

exports.meta = {
    operatorOnly: false,
    name: "user description",
    usage: `${process.env.PREFIX || "!"}desc <info> or ${process.env.PREFIX ||
        "!"}desc clear`,
    description: "Adds a description to your profile, 256 characters max"
};
