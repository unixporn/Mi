require("discord.js").Structures.extend("Message", (Message) => {
    return class extends Message {
        constructor(client, data, channel) {
            super(client, data, channel);
            this.authorDisplayName = this.member
                ? this.member.displayName
                : this.author.username;
        }
    };
});
