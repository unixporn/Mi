exports.run = async (client, message, args, Discord) => {
    if (!args.length) {
        return message.channel.embed(
            `**${message.authorName}**, use \`${process.env.PREFIX ||
                "!"}setrole <rolename>\``
        );
    }

    let role;

    if (args[0] == parseInt(args[0])) {
        role = message.guild.roles.get(args[0]);
    } else {
        role = message.guild.roles.find(
            (r) => r.name.toLowerCase() === args.join(" ").toLowerCase()
        );
    }

    if (!role) {
        return message.channel.embed(
            `**${message.authorName}**, I couldn't find that role`
        );
    }

    client.RoleSchema.findOne(
        {
            id: message.guild.id
        },
        async (error, config) => {
            if (error) {
                return console.error(error);
            }

            if (!config) {
                config = new client.RoleSchema({
                    id: message.guild.id,
                    colorRoles: [role.id]
                })
                    .save()
                    .catch((e) => {
                        console.error(e);
                    });
            }

            if (config.colorRoles.includes(role.id)) {
                message.channel.embed(
                    `**${message.authorName}**, are you sure you want to **remove** ${role} from the role list?`,
                    { footer: "yes / no" }
                );

                try {
                    var response = await message.channel.awaitMessages(
                        (m) =>
                            ["yes", "y", "no", "n"].includes(
                                m.content.toLowerCase()
                            ) && m.author === message.author,
                        {
                            max: 1,
                            time: 10000,
                            errors: ["time"]
                        }
                    );
                } catch (err) {
                    return message.channel.embed(
                        `**${message.authorName}**, cancelled selection, missing or invalid input`
                    );
                }
                response = response.first().content.toLowerCase();

                if (["no", "n"].includes(response)) {
                    return message.channel.embed(
                        `**${message.authorName}**, cancelled operation`
                    );
                }

                config.colorRoles.splice(config.colorRoles.indexOf(role.id), 1);
            } else {
                config.colorRoles.push(role.id);
            }

            message.channel.send(
                new Discord.MessageEmbed()
                    .setColor(message.color)
                    .setTitle(`Updated role list for **${message.guild.name}**`)
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
            );

            config.save().catch((e) => {
                console.error(e);
            });
        }
    );
};

exports.meta = {
    operatorOnly: true,
    name: "role set",
    usage: "setrole <rolename>",
    description: "Adds role to list of available roles"
};
