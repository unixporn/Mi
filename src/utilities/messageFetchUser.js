require("discord.js").Structures.extend(
    "Message",
    Message => {
        return class extends Message {
            constructor(client, data, channel) {
                super(client, data, channel);
                this.fetchUser = options => {
                    options = options || {};
                    let args = this.content
                            .split(" ")
                            .slice(1),
                        user;
                    try {
                        if (this.mentions.users.size) {
                            user = this.mentions.users.first();
                        } else if (!isNaN(args.join(" "))) {
                            if (
                                client.users.cache.get(
                                    args.join(" ")
                                )
                            ) {
                                user = client.users.cache.get(
                                    args.join(" ")
                                );
                            }
                        } else if (args[0]) {
                            if (
                                (user = this.guild.members.cache.find(
                                    m =>
                                        m.displayName.toLowerCase() ===
                                        args
                                            .join(" ")
                                            .toLowerCase()
                                ))
                            ) {
                                user = user.user;
                            } else if (
                                (user = this.guild.members.cache.find(
                                    m =>
                                        m.user.username.toLowerCase() ===
                                        args
                                            .join(" ")
                                            .toLowerCase()
                                ))
                            ) {
                                user = user.user;
                            }
                        }
                    } finally {
                        if (!user || user === this.author) {
                            if (options.notSelf) {
                                user = null;
                            } else {
                                user = this.author;
                            }
                        }
                        return options.member
                            ? this.guild.members.cache.get(
                                  user
                              )
                            : user;
                    }
                };
            }
        };
    }
);
