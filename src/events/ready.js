module.exports = (client) => {
    console.log(`--- ${client.user.username} started ---`);
    client.user.setPresence({
        activity: {
            type: "WATCHING",
            name: `for ${process.env.PREFIX || "!"}help`
        },
        status: "online"
    });
};
