exports.run = async (client, message, args, Discord) => {
    client.RoleSchema.findOne(
        {
            id: message.guild.id
        },
        async (error, config) => {
            if (error) {
                return console.error(error);
            }

            if (!config && !config.colorRoles[0]) {
                return message.channel.embed(
                    `**${message.authorName}**, no colour roles available at this time`
                );
            }

            message.channel.send(
                new Discord.MessageEmbed()
                    .setColor(message.color)
                    .setDescription(
                        config.colorRoles
                            .sort(
                                (a, b) =>
                                    message.guild.roles.get(b).position -
                                    message.guild.roles.get(a).position
                            )
                            .map((r) => message.guild.roles.get(r))
                            .join("\n")
                    )
                    .setFooter(`${process.env.PREFIX || "!"}role <rolename>`)
            );
        }
    );
};

exports.meta = {
    operatorOnly: false,
    name: "role list",
    usage: "l",
    description: "Lists colour roles."
};
