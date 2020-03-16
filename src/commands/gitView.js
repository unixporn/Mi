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
            guild: message.guild.id
        },
        async (error, config) => {
            if (error) {
                return console.error(error);
            }

            if (!config) {
                config = new client.UserSchema(
                    Object.assign(client.settings.UserSchema.default, {
                        id: user.id,
                        guild: message.guild.id
                    })
                )
                    .save()
                    .catch((e) => console.error(e));
            }

            await config;

            if (user === message.author) {
                message.channel.embed(
                    config.profile.git
                        ? `**Git** for ${user} **${config.profile.git}**`
                        : `**${
                              message.authorDisplayName
                          }**, please use \`\`\`${process.env.PREFIX ||
                              "!"}setgit <url>\`\`\``
                );
            } else {
                message.channel.embed(
                    config.profile.git
                        ? `**Git** for ${user} **${config.profile.git}**`
                        : `**${user}** hasn't set their Git link.`
                );
            }
        }
    );
};

exports.meta = {
    operatorOnly: false,
    name: "user git",
    usage: `${process.env.PREFIX || "!"}git <@user>`,
    description: "Display user's Git link."
};
