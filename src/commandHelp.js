module.exports = (client, Discord, name) => {
    if (!(command = client.commands.get(name))) {
        throw new RangeError(`"${name}" is not a command.`);
    }

    return new Discord.MessageEmbed().addField(
        command.meta.name.toTitleCase(),
        `\`${command.meta.usage}\`\n${command.meta.description}`
    );
};
