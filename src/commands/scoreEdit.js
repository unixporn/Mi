exports.run = async (client, message, args, Discord) => {
    const user = message.fetchUser({
        notSelf: true
    });

    if (!user) {
        return client.commandHelp(message);
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
                );
            }

            let amount;

            message.channel.embed(
                `**${message.authorDisplayName}**, what do you want to adjust ${user}'s score by?`,
                { footer: "Enter a positive or negative number..." }
            );

            try {
                amount = await message.channel.awaitMessages(
                    (m) => parseFloat(m),
                    {
                        max: 1,
                        time: client.settings.confirmDialogues.timeout,
                        errors: ["time"]
                    }
                );
            } catch (err) {
                return message.channel.embed(
                    `**${message.authorDisplayName}**, **cancelled** selection, missing or invalid input`
                );
            }
            amount = parseFloat(amount.first().content);

            message.channel.embed(
                `${user}'s score will be set to **${config.score +
                    amount}** (from ${config.score}), **confirm**?`,
                { footer: "Yes or no..." }
            );

            try {
                var response = await message.channel.awaitMessages(
                    (m) =>
                        ["yes", "y", "no", "n"].includes(
                            m.content.toLowerCase()
                        ) && m.author === message.author,
                    {
                        max: 1,
                        time: client.settings.confirmDialogues.timeout,
                        errors: ["time"]
                    }
                );
            } catch (err) {
                return message.channel.embed(
                    `**${message.authorDisplayName}**, cancelled selection, missing or invalid input`
                );
            }
            response = response.first().content.toLowerCase();

            if (["no", "n"].includes(response)) {
                return message.channel.embed(
                    `**${message.authorDisplayName}**, cancelled operation`
                );
            }

            config.score += amount;

            config.save().catch((e) => console.error(e));

            client.emit("userScoreUpdate", config);

            message.channel.embed(
                `${user}'s score is now **${config.score}**.`
            );
        }
    );
};

exports.meta = {
    operatorOnly: true,
    name: "user rep",
    usage: `${process.env.PREFIX || "!"}rep <@user>`,
    description: "Add or retract rep from user"
};
