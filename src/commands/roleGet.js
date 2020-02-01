exports.run = async (client, message, args, Discord) => {
    if (!args.length) {
        return message.channel.embed(
            `**${message.authorName}**, usage \`${process.env.PREFIX ||
                "!"}r <rolename>\``
        );
    }

    const role = message.guild.roles.find(
        (r) =>
            r.name.toLowerCase() ===
            args
                .join(" ")
                .toLowerCase()
                .replace("@", "")
    );

    if (!role) {
        return message.channel.embed(
            `**${message.authorName}**, role \`${args.join(" ")}\` not found`
        );
    }

    client.RoleSchema.findOne(
        { id: message.guild.id },
        async (error, config) => {
            if (error) {
                return console.error(error);
            }

            if (config.colorRoles.includes(role.id)) {
                if (!message.member.roles.has(role.id)) {
                    await message.member.roles
                        .filter((r) => config.colorRoles.includes(r))
                        .every((r) =>
                            message.member.roles
                                .remove(r)
                                .catch((e) => console.error(e))
                        );

                    await message.member.roles.add(role);

                    message.channel.embed(
                        `Added **${role}** to **${message.author}**`
                    );
                } else {
                    await message.member.roles.remove(role);
                    message.channel.embed(
                        `Removed **${role}** from **${message.author}**`
                    );
                }
            } else {
                message.channel.embed(
                    `**${message.authorName}**, role ${role} unavailable`
                );
            }
        }
    );
};

exports.meta = {
    operatorOnly: false,
    name: "role get",
    usage: "r <rolename>",
    description: "Adds input colour role to self."
};
