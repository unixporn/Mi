exports.run = async (client, message, args, Discord) => {
    let user = message.fetchUser();

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
                .setTitle(
                    `**${
                        message.guild.members.cache.get(user.id).displayName
                    }**`
                )
                .setThumbnail(user.avatarURL({ size: 2048 }))
                .addField("Score", config.score)
                .addField(
                    "Rep history",
                    config.repHistory.length
                        ? config.repHistory
                              .map(
                                  (i) =>
                                      `${
                                          i.reps
                                      } ${message.guild.members.cache.find(
                                          (m) => m.id === i.user
                                      )}`
                              )
                              .join("\n")
                        : "None"
                );

            message.channel.send(embed);
        }
    );
};

exports.meta = {
    operatorOnly: true,
    name: "user profile",
    usage: `${process.env.PREFIX || "!"}profile <user>`,
    description: "Displays profile for input user"
};
