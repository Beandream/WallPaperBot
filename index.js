const Discord = require('discord.js');
const client = new Discord.Client();
const data = require("./dataV3.json");
const version = "v5.1";

client.on('ready', () => {console.log(`Logged in as ${client.user.tag}!`)});
client.on('error', err => { console.log(err) });

client.on('message', msg => {
    if (msg.author.bot) return;
    
    if (msg.isMemberMentioned(client.user)) {
        runCmd(msg);
    } else {
        checkMsgType(msg);
    }
})

function checkMsgType(msg) {
    data.servers.forEach(server => {
        if (msg.guild.id == server.id) {
            if (msg.channel.id == server.videoChannel.id) {
                if (isVideo(msg)){
                    cleanChannel(msg);
                };
            } else if (msg.channel.id == server.imageChannel.id) {
                if (isImage(msg)){
                    cleanChannel(msg);
                };
            }
        };
    });
}

function cleanChannel(msg) { // removes all none submission messages from the submission textchannel
    data.servers.forEach(server => {
        if (server.id == msg.guild.id) {
            if (msg.channel.id == server.videoChannel.id) { //check for videos
                msg.channel.fetchMessages({ limit: 100 }).then(messages => {
                    messages.forEach(message => {
                        if (!isVideo(message)) {
                            deleteMsg(message, 0);
                        }
                    });
                });
                return;
            } else if (msg.channel.id == server.imageChannel.id) { //check for images
                msg.channel.fetchMessages({ limit: 100 }).then(messages => {
                    messages.forEach(message => {
                        if (!isImage(message)) {
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
        if (msg.embeds[0].type == "video") {
            return true;
        }
    } else if (msg.attachments.size > 0) {
        let attachArray = Array.from(msg.attachments.values());
        let url = attachArray[0].url.toUpperCase();
        if (url.slice(url.length - 3) == "MP4" || url.slice(url.length - 3) == "MOV" || url.slice(url.length - 3) == "MKV") {
            return true;
        } else {
            return false;
        }
    }
    return false;
}

function isImage (msg) {
    if (msg.embeds[0]) {
        if (msg.embeds[0].image) {
            return true;
        }
    } else if (msg.attachments.size > 0) {
        let attachArray = Array.from(msg.attachments.values());
        let url = attachArray[0].url.toUpperCase();
        if (url.slice(url.length - 3) == "PNG" || url.slice(url.length - 3) == "JPG") {
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
    var help = str.search('HELP');

    if (hi > -1) {
        sendMsg(msg, `Hello, ${msg.author}`, -1);
    } else if (help > -1) {
        sendMsg(msg, "Current version: " + version, 5000);
    } else if (clean > -1) {
        cleanChannel(msg);
    } else if (reset > -1) {
        data.mods.forEach(user => {
            if (msg.author.id == user.id) {
                deleteAll(msg);
            }
        })
    } else {
        checkMsgType(msg);
    }
}

function deleteAll(msg) {
    data.servers.forEach(server => {
        if (server.id == msg.guild.id) {
            if (msg.channel.id == server.videoChannel.id || msg.channel.id == server.imageChannel.id) {
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
            msg.delete(delay).catch(err => {
                console.log(`Might be Missing MANAGE_MESSAGES permissions to delete ${msg.author.username}'s message`);
                console.log(err);
            });
        };
    });
}

function sendMsg(msg, text, delay) {
    msg.channel.send(text).then(myMsg => {
        if (delay > -1) {
            deleteMsg(myMsg, delay);
            deleteMsg(msg, delay);
        }
    }).catch();
}

client.login(process.env.BOT_TOKEN);