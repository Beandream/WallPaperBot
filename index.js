const Discord = require('discord.js');
const client = new Discord.Client();
const data = require("./dataV3.json");
const version = "v5.0";

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('error', err => { console.log(err) });

client.on('message', msg => {
    if (msg.author.bot) return;

    data.servers.forEach(server => {
        if (server.id == msg.guild.id) {
            if (msg.channel.id == server.channel.id) {
                readMsg(msg);
            }
        };
    });
})

function readMsg(msg) {
    if (msg.isMemberMentioned(client.user)) {
        runCmd(msg);
    } else {
        if (isVideo(msg)){
            console.log("Hello?");
            cleanChannel(msg);
        };
    }
}

function cleanChannel(msg) { // removes all none submission messages from the submission textchannel
    data.servers.forEach(server => {
        if (server.id == msg.guild.id) {
            if (msg.channel.id == server.channel.id) {
                msg.channel.fetchMessages({ limit: 100 }).then(messages => {
                    messages.forEach(message => {
                        if (!isVideo(message)) {
                            deleteMsg(message, 0);
                        }
                    });
                });
                return;
            };
            return;
        }
    })
}

function isVideo (msg) {
    if (msg.embeds[0]) {
        if (msg.embeds[0].video) {
            return true;
        }
    } else if (msg.attachments.size > 0) {
        let attachArray = Array.from(msg.attachments.values());
        let url = attachArray[0].url;
        if (url.slice(url.length - 3) == "mp4" || url.slice(url.length - 3) == "mov" || url.slice(url.length - 3) == "mkv") {
            return true;
        } else {
            return false;
        }
    }
    return false;
}

function runCmd(msg) {
    var str = msg.content.toUpperCase();
    var hi = str.search('HI');
    var reset = str.search('RESET');
    var clean = str.search('CLEAN');

    if (hi > -1) {
        msg.channel.send(`Hello, ${msg.author}`).then(botMsg => { deleteMsg(botMsg, 5000); }).catch();
    } else if (clean > -1) {
        cleanChannel(msg);
    } else if (reset > -1) {
        if (msg.author.id == "277203191924391946") {
            deleteAll(msg);
        } else {
            msg.channel.send("**Hey! you're not Beandream!**").then(botMsg => { deleteMsg(botMsg, 5000); }).catch();;
        }
    } else {
        if (isVideo(msg)){
            cleanChannel(msg);
        };
        return;
    }
    deleteMsg(msg, 500);
}

function deleteAll(msg) {
    data.servers.forEach(server => {
        if (server.id == msg.guild.id) {
            if (msg.channel.id == server.channel.id) {
                msg.channel.fetchMessages({ limit: 100 }).then(messages => {
                    messages.forEach(message => {
                        deleteMsg(message, 0);
                    });
                });
                return;
            };
            return;
        }
    })
}

function deleteMsg(msg, delay) {
    data.servers.forEach(server => {
        if (server.id == msg.guild.id) {
            if (msg.channel.id == server.channel.id) {
                msg.delete(delay).catch(err => {
                    console.log(`Might be Missing MANAGE_MESSAGES permissions to delete ${msg.author.username}'s message`);
                    console.log(err);
                });
            };
        };
    });
}

client.login(process.env.BOT_TOKEN);