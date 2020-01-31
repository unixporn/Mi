# Mi

### Discord bot for the [r/unixporn](https://reddit.com/r/unixporn) server

##### This bot was written with a very specific server in mind, don't expect it to be useful in your server.

---

### Requirements

**Node.js v12** JS runtime

**npm** for libraries

---

### Setup and Config

Clone the repo and run `npm install` in the root dir to install dependencies from `package.json`.

Create a `.env` file with the following variables.

```
TOKEN=bot token
MONGO=mongodb remote token
PREFIX=prefix for commands, ideally a single char, defaults to ! if unset
SHOWCASECHANNEL=showcase channel id for automod
LOGCHANNEL=modlog channel id
RICINGCHANNEL=ricing channel id
HOSTID=discord user id of host, for eval restriction
```

If you don't know where to find the values for configuration, this bot isn't for you.

---

### Commands

Paths and triggers for new commands must be added to `src/commands.js`.

Commands must adhere to the following standard:

```js
/*
 * client = Discord bot object
 * message = message that called the command
 * args = array containing the message's content excluding the prefix and command
 * Discord = discord.js library
 */

exports.run = async (client, message, args, Discord) => {
    //Code goes here
};

exports.meta = {
    adminOnly: Boolean, //Whether or not the command is restricted to admin only.
    name: String, //Name of command to appear on help section.
    usage: String, //Usage example for command.
    description: String //Description of command to appear on help section.
};
```

---

### Messages

All messages must be sent as embeds.

This can be done via the `TextChannel.embed()` method

```js
message.channel.embed("Message body", { footer: "Optional footer" });
```

or by manually creating a `Discord.MessageEmbed()`.

When creating embeds be sure to use `Message.color`

```js
new Discord.MessageEmbed().setColor(message.color);
```

---

### Message formatting

Fetching a user's display-name is handled by `Message.authorName`

```js
message.channel.embed(`**${message.authorName}**, success!`);
```

Simple messages:

> **User**, message

Reference to user input:

> **User**, `input` not found

Reference to role or channel:

> **User**, check out #channel

> **User**, @role added to list

Reference to role in context of user:

> @role added to @user

Links:

> **User**, set link to **https://url.tld**

Links in context of user:

> Set link of @user to **https://url.tld**
