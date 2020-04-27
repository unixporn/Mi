module.exports = (client, member, Discord) => {
    client.UserSchema.findOne(
        {
            id: member.id,
            guild: member.guild.id,
        },
        (error, config) => {
            if (error) {
                return console.error(config);
            }

            if (!config) {
                config = new client.UserSchema(
                    Object.assign(
                        client.settings.UserSchema.default,
                        {
                            id: member.id,
                            guild: member.guild.id,
                        }
                    )
                );
            }

            client.sendLog(
                new Discord.MessageEmbed()
                    .setColor("#FFFFFE")
                    .setAuthor(
                        member.displayName,
                        member.user.avatarURL({ size: 256 })
                    )
                    .addField(
                        "Account created",
                        new Date(
                            member.user.createdTimestamp
                        ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                        })
                    )
                    .setFooter("Member joined")
            );
        }
    );
};
