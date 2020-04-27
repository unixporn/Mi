exports.run = async (client, message, args, Discord) => {
    const user = message.fetchUser();

    if (!user) {
        return message.channel.embed(
            `**${message.authorDisplayName}**, I couldn't find that user`
        );
    }

    client.UserSchema.findOne(
        {
            id: user.id,
            guild: message.guild.id,
        },
        async (error, config) => {
            if (error) {
                return console.error(error);
            }

            if (!config) {
                config = new client.UserSchema(
                    Object.assign(
                        client.settings.UserSchema.default,
                        {
                            id: user.id,
                            guild: message.guild.id,
                        }
                    )
                )
                    .save()
                    .catch(e => console.error(e));
            }

            await config;

            if (user === message.author) {
                message.channel.embed(
                    config.profile.dotfiles
                        ? `**dotfiles** for ${user} **${config.profile.dotfiles}**`
                        : `**${
                              message.authorDisplayName
                          }**, please use: \`\`\`${
                              process.env.PREFIX || "!"
                          }setdotfiles <url>\`\`\``
                );
            } else {
                message.channel.embed(
                    config.profile.dotfiles
                        ? `**Dotfiles** for ${user} **${config.profile.dotfiles}**`
                        : `**${user}** hasn't set their dotfiles link.`
                );
            }
        }
    );
};

exports.meta = {
    operatorOnly: false,
    name: "user dots",
    usage: `${process.env.PREFIX || "!"}dots <@user>`,
    description: "Display user's dotfiles link.",
};
