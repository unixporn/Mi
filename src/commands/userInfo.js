const handleDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
};

exports.run = async (client, message, args, Discord) => {
    let user = message.fetchUser();

    if (!user) {
        return message.channel.embed(
            `**${message.authorDisplayName}**, I couldn't find that user`
        );
    }

    const member = message.guild.members.cache.get(user.id);

    client.UserSchema.findOne(
        {
            id: user.id,
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

            await config;

            const embed = new Discord.MessageEmbed()
                .setColor(message.color)
                .setTitle(`**${member.displayName}**`)
                .setThumbnail(user.avatarURL({ size: 2048 }))
                .addField("Joined server", handleDate(member.joinedTimestamp))
                .addField(
                    "Account created",
                    handleDate(member.user.createdTimestamp)
                )
                .addField("Points", Math.floor(config.score))
                .addField(
                    "Roles",
                    member.roles.cache.map((r) => r).join(" "),
                    true
                );

            if (config.profile.git) {
                embed.addField("Git", config.profile.git);
            }

            if (config.profile.dotfiles) {
                embed.addField("Dotfiles", config.profile.dotfiles);
            }

            if (config.profile.description) {
                embed.setDescription(config.profile.description);
            }

            message.channel.send(embed);
        }
    );
};

exports.meta = {
    operatorOnly: false,
    name: "user profile",
    usage: `${process.env.PREFIX || "!"}profile <user>`,
    description: "Displays profile for input user"
};
