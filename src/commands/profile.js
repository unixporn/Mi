exports.run = async (client, message, args, Discord) => {
    let user = message.fetchUser();

    if (!user) {
        return message.channel.embed(
            `**${message.authorName}**, I couldn't find that user`
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
                config = await new client.UserSchema({
                    id: user.id,
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

            const embed = new Discord.MessageEmbed()
                .setColor(message.color)
                .setTitle(`**${member.displayName}**`)
                .setThumbnail(user.avatarURL({ size: 2048 }))
                .addField(
                    "Joined server",
                    new Date(member.joinedTimestamp).toLocaleDateString(
                        "en-US",
                        {
                            year: "numeric",
                            month: "long",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false
                        }
                    )
                )
                .addField(
                    "Account created",
                    new Date(member.user.createdTimestamp).toLocaleDateString(
                        "en-US",
                        {
                            year: "numeric",
                            month: "long",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false
                        }
                    )
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
