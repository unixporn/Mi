require("dotenv").config();
const Discord = require("discord.js");

require("./utilities/messageAuthorDisplayName.js");
require("./utilities/messageColor.js");
require("./utilities/messageFetchUser.js");
require("./utilities/stringToTitleCase.js");
require("./utilities/textChannelEmbed.js");

module.exports = class extends Discord.Client {
    constructor() {
        super({
            //Disables @everyone ping
            disableEveryone: true,
            //Optimizations, some unnecessary but useful in case of API changes
            autoReconnect: true,
            fetchAllMembers: true,
            messageCacheMaxSize: 50,
            messageCacheLifetime: 120,
            messageSweepInterval: 120,
            restTimeOffset: 2500,
            restSweepInterval: 30,
            ws: {
                compress: false
            },
            disabledEvents: [
                "TYPING_START",
                "PRESENCE_UPDATE",
                "USER_UPDATE",
                "WEBHOOKS_UPDATE",
                "MESSAGE_REACTION_ADD"
            ]
        });

        //Settings file
        this.settings = require("./settings.json");

        //Database schema for per-guild colour role list
        this.RoleSchema = require("./models/roleSchema.js");

        //Database schema for per-user profile and stats
        this.UserSchema = require("./models/userSchema.js");

        this.commands = require("./commands.js");

        //Import message handler only once
        this.message = (message) =>
            require("./events/message.js")(this, message, Discord);

        this.ready = () => require("./events/ready.js")(this);

        this.messageDelete = (message) =>
            require("./events/messageDelete.js")(this, message, Discord);

        this.guildMemberAdd = (member) =>
            require("./events/guildMemberAdd.js")(this, member, Discord);

        this.showcase = (client, message) =>
            require("./events/showcase.js")(client, message, Discord);

        this.sendLog = (message) =>
            this.channels.cache.get(this.settings.logChannel).send(message);

        this.commandHelp = (name) =>
            require("./utilities/miFetchCommandHelp.js")(this, name);

        this.handleMessageScore = (message) =>
            require("./events/handleMessageScore.js")(this, message);

        this.log = (log) =>
            require("./events/handleLog.js")(this, log, Discord);

        this.createUserSchema = (user, guild) =>
            require("./createUserSchema.js")(this, user, guild);

        this.on("userScoreUpdate", (scoreUpdate) =>
            require("./events/userScoreUpdate.js")(this, scoreUpdate)
        );

        this
            //Events
            .on("ready", () => this.ready())

            .on("reconnect", () => this.ready())

            .on("message", (message) => this.message(message))

            .on("guildMemberAdd", (member) => this.guildMemberAdd(member))

            .on("messageDelete", (message) => this.messageDelete(message));

        //Connect to MongoDB
        require("mongoose").connect(process.env.MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        process
            .on("unhandledRejection", (error) => {
                this.log(error.message);
            })
            .on("uncaughtException", (error) => {
                this.log(error.message);
            })
            .on("warning", (error) => {
                this.log(error.message);
            });

        this.login(process.env.TOKEN);
    }
};
