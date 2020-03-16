exports.run = async (client, message, args, Discord) => {
    const user = message.fetchUser();

    if (user === message.author && args.length) {
        return message.channel.embed(
            `**${message.authorDisplayName}**, if you want to clear your own profile use \`\`\`${process.env.PREFIX}clear\`\`\``
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
                    `**${message.authorDisplayName}**, you cannot clear the profile of other users`
                );
            }

            if (!config || !config.profile) {
                return message.channel.embed(
                    `**${message.authorDisplayName}**, nothing to clear`
                );
            }

            message.channel.embed(
                `**${message.authorDisplayName}**, are you sure y ou want to **clear** the profile of user ${user}?`,
                { footer: "Yes or no..." }
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
    usage: `${process.env.PREFIX || "!"}purge <user>`,
    description: "Clears custom entries on user profile"
};
