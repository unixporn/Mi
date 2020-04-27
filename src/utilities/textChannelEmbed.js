const Discord = require("discord.js");

Discord.Structures.extend("TextChannel", TextChannel => {
    return class extends TextChannel {
        constructor(guild, data) {
            super(guild, data);
            this.embed = (body, options) => {
                options = options || {};

                if (!body || typeof body !== "string") {
                    return console.error(
                        "No body provided to embed method."
                    );
                }

                let embed = new Discord.MessageEmbed()
                    .setDescription(body.substring(0, 2048))
                    .setColor(
                        this.guild &&
                            ![
                                "#000000",
                                "#ffffff",
                            ].includes(
                                this.guild.me
                                    .displayHexColor
                            )
                            ? this.guild.me.displayHexColor
                            : "#fffffe"
                    );

                if (
                    options.footer &&
                    typeof options.footer === "string"
                ) {
                    embed.setFooter(options.footer);
                }

                this.send(embed);
            };
        }
    };
});
