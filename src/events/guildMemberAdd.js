module.exports = async (client, member, Discord) => {
    await client.UserSchema.findOne(
        {
            id: member.id,
            guild: member.guild.id
        },
        (error, config) => {
            if (error) {
                return console.error(config);
            }

            if (!config) {
                config = new client.UserSchema({
                    id: member.id,
                    guild: member.guild.id,
                    profile: {
                        git: "",
                        dotfiles: "",
                        description: ""
                    }
                })
                    .save()
                    .catch((e) => console.error(e));
            }

            client.sendLog(
                new Discord.MessageEmbed()
                    .setColor("#FFFFFE")
                    .setAuthor(member.displayName, member.user.avatarURL({ size: 2048 }))
                    .setTitle("Member joined")
                    .addField("User", member)
                    .addField("Account created", member.user.createdAt)
                    .setFooter(new Date())
            );
        }
    );
};
