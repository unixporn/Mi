exports.run = async (client, message, args, Discord) => {
    if (!args.length) {
        return message.channel.send(
            client
                .commandHelp("desc")
                .setColor(message.color)
                .setTitle("Usage:")
        );
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
                config = await new client.UserSchema({
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

            if (["clear", "remove"].includes(args[0].toLowerCase())) {
                if (!config.profile.description) {
                    return message.channel.embed(
                        `**${message.authorName}**, nothing to remove.`
                    );
                }

                message.channel.embed(
                    `**${message.authorName}**, are you sure you want to clear your profile description?`,
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
                        `**${message.authorName}**, cancelled selection, missing or invalid input.`
                    );
                }
                response = response.first().content.toLowerCase();

                if (["no", "y"].includes(response)) {
                    return message.channel.embed(
                        `**${message.authorName}**, cancelled operation.`
                    );
                }

                config.profile.dotfiles = "";

                message.channel.embed(
                    `Removed **description** from user **${client.authorName}**.`
                );
            } else if (args) {
                if (args.join(" ").length <= 256) {
                    config.profile.description = args.join(" ");

                    message.channel.embed(
                        `Set **description** of user **${client.authorName}**.`
                    );
                } else {
                    return message.channel.embed(
                        `**${message.authorName}**, maximum length 256 characters.`
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
