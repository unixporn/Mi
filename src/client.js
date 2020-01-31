require("dotenv").config();
const Discord = require("discord.js");

require("./extensions.js");

module.exports = class extends Discord.Client {
    constructor() {
        super({
            //Disables @everyone ping
            disableEveryone: true,
            autoReconnect: true,
            fetchAllMembers: true,
            messageCacheMaxSize: 50,
            messageCacheLifetime: 120,
            messageSweepInterval: 120,
            ws: {
                compress: false
            },
            disabledEvents: ["TYPING_START", "PRESENCE_UPDATE", "MESSAGE_UPDATE", "USER_UPDATE"]
        });

        //Database schema for per-guild colour role list
        this.RoleSchema = require("./models/roleSchema.js");

        //Database schema for per-user profile and stats
        this.UserSchema = require("./models/userSchema.js");

        this.commands = require("./commands.js");

        //Import message handler only once
        this.message = (message) => require("./events/message.js")(this, message, Discord);

        this.ready = () => require("./events/ready.js")(this);

        this.messageDelete = (message) => require("./events/messageDelete.js")(this, message, Discord);

        this.guildMemberAdd = (member) => require("./events/guildMemberAdd.js")(this, member, Discord);

        this.showcase = (client, message) => require("./events/showcase.js")(client, message, Discord);

        this.sendLog = (message) => this.channels.get(process.env.LOGCHANNEL).send(message);

        //Events
        this
            //Ready
            .on("ready", () => this.ready())

            .on("reconnect", () => this.ready())

            //Message
            .on("message", (message) => this.message(message))

            //Update config on member join
            .on("guildMemberAdd", (member) => this.guildMemberAdd(member))

            .on("messageDelete", (message) => this.messageDelete(message));

        //Connect to MongoDB
        require("mongoose").connect(process.env.MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        this.login(process.env.TOKEN);
    }
};
