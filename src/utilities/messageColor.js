require("discord.js").Structures.extend("Message", (Message) => {
    return class extends Message {
        constructor(client, data, channel) {
            super(client, data, channel);

            /*
            Due to a bug on Discord's side, 
            #ffffff does not appear correctly 
            so we set it to #fffffe
            */

            this.color =
                this.guild &&
                !["#000000", "#ffffff"].includes(this.guild.me.displayHexColor)
                    ? this.guild.me.displayHexColor
                    : "#fffffe";
        }
    };
});
