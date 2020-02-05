const Discord = require("discord.js");

Discord.Structures.extend("Message", (Message) => {
    return class Msg extends Message {
        constructor(client, data, channel) {
            super(client, data, channel);
            this.authorName = this.member
                ? this.member.displayName
                : this.author.username;

            // Due to a bug on Discord's side, #ffffff does not appear correctly so we set it to #fffffe\
            this.color =
                this.guild &&
                !["#000000", "#ffffff"].includes(this.guild.me.displayHexColor)
                    ? this.guild.me.displayHexColor
                    : "#fffffe";

            this.fetchUser = (options) => {
                options = options || {};

                const args = this.content.split(" ").slice(1);

                let user;

                if (this.mentions.users.size) {
                    user = this.mentions.users.first();
                } else if (args[0]) {
                    if (
                        this.guild.members.find(
                            (m) =>
                                m.displayName.toLowerCase() ===
                                args.join(" ").toLowerCase()
                        )
                    ) {
                        user = this.guild.members.find(
                            (m) =>
                                m.displayName.toLowerCase() ===
                                args.join(" ").toLowerCase()
                        ).user;
                    } else {
                        user = client.users.find(
                            (u) =>
                                u.username.toLowerCase() ===
                                args.join(" ").toLowerCase()
                        );
                    }
                } else {
                    user = this.author;
                }

                return options.member ? this.guild.members.get(user) : user;
            };
        }
    };
});

Discord.Structures.extend("TextChannel", (TextChannel) => {
    return class Channel extends TextChannel {
        constructor(guild, data) {
            super(guild, data);
            this.embed = (body, options) => {
                options = options || {};

                if (!body || typeof body !== "string") {
                    return console.error("No body provided to embed method.");
                }

                let embed = new Discord.MessageEmbed()
                    .setDescription(body)
                    .setColor(
                        this.guild &&
                            !["#000000", "#ffffff"].includes(
                                this.guild.me.displayHexColor
                            )
                            ? this.guild.me.displayHexColor
                            : "#fffffe"
                    );

                if (options.footer && typeof options.footer === "string") {
                    embed.setFooter(options.footer);
                }

                this.send(embed);
            };
        }
    };
});

Object.assign(String.prototype, {
    toTitleCase(str) {
        return this.toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }
});
