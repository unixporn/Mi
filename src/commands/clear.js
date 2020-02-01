exports.run = async (client, message, args, Discord) => {
    const user = message.fetchUser();

    if (user === message.author && args.length) {
        return message.channel.embed(
            `**${message.authorName}**, if you want to clear your own profile use \`${process.env.PREFIX}clear\``
        );
    }

    client.UserSchema.findOne(
        {
            id: user.id,
            guild: message.guild.id
        },
        async (error, config) => {
            if (error) {
                return console.error(error);
            }

            if (
                user !== message.author &&
                !message.member.hasPermission("MANAGE_GUILD")
            ) {
                return message.channel.embed(
                    `**${message.authorName}**, you cannot clear the profile of other users`
                );
            }

            if (!config || !config.profile) {
                return message.channel.embed(
                    `**${message.authorName}**, nothing to clear`
                );
            }

            message.channel.embed(
                `**${message.authorName}**, are you sure you want to **clear** the profile of user ${user}?`,
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

            config.profile = {
                git: "",
                dots: "",
                description: ""
            };

            message.channel.embed(`Cleared **profile** of user **${user}**`);

            config.save().catch((e) => console.error(e));
        }
    );
};

exports.meta = {
    operatorOnly: true,
    name: "user clear",
    usage: "purge <user>",
    description: "Clears custom entries on user profile"
};
