exports.run = async (client, message, args, Discord) => {
    let user = message.fetchUser();

    if (!user) {
        return message.channel.embed(
            `**${message.authorName}**, I couldn't find that user`
        );
    }

    const member = message.guild.members.get(user.id);

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
                return message.channel.embed(
                    `**${message.authorName}**, you shouldn't be seeing this... just like... ignore it?`
                );
            }

            const embed = new Discord.MessageEmbed()
                .setColor(message.color)
                .setTitle(`**${member.displayName}**`)
                .setThumbnail(user.avatarURL({ size: 2048 }))
                .addField(
                    "Joined server",
                    client.processTime(member.joinedTimestamp, {
                        dateOnly: true
                    })
                )
                .addField(
                    "Created account",
                    client.processTime(user.createdAt, { dateOnly: true })
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
    usage: "profile <user>",
    description: "Displays profile for input user"
};
