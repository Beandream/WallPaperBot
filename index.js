const Discord = require('discord.js');
const client = new Discord.Client();
const data = require("./dataV3.json");
const version = "v5.0";
var currentSubmits = [];

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
        getImg(msg);
    }
}

function runCmd(msg) {
    var str = msg.content.toUpperCase();

    var help = str.search('HELP');
    var hi = str.search('HI');
    var del = str.search('DELETE');

    if (help > -1) {
        msgHelp(msg);
    } else if (hi > -1) {
        msg.channel.send(`Hello, ${msg.author}`).then(botMsg => { deleteMsg(botMsg, 5000); }).catch();
    } else if (del > -1) {
        if (msg.author.id == "277203191924391946") {
            deleteAll(msg);
        } else {
            msg.channel.send("**Hey! you're not Beandream!**").then(botMsg => { deleteMsg(botMsg, 5000); }).catch();;
        }
    } else {
        getImg(msg);
        return;
    }
    deleteMsg(msg, 100);
}

function msgHelp(msg) {
    msg.channel.send({
        embed: {
            color: 4570716,
            author: {
                name: "WallpaperBot",
                icon_url: "https://cdn.discordapp.com/attachments/442805569485537290/538882719451709441/wallpaperBot2.png"
            },
            thumbnail: {
                url: "https://cdn.discordapp.com/attachments/442805569485537290/538882719451709441/wallpaperBot2.png"
            },
            title: "How to Submit",
            footer: {
                text: `Wallpaper Bot ${version}`
            },
            fields: [
                {
                    name: "**Upload an image through discord**",
                    value: "```Using a link will not work.```"
                },
                {
                    name: "**Include a message to your message for a description**",
                    value: "```Any text you send with the message will be included as a description to your wallpaper.```"
                }
            ],
        }
    }).then(botMsg => { deleteMsg(botMsg, 15000); }).catch();
}

function getImg(msg, disc) {


    if (msg.attachments.size > 0) {
        let attachArray = Array.from(msg.attachments.values());
        var imgUrl = attachArray[0].url
        var fileName = attachArray[0].filename
        var disc = msg.content;
        var username = msg.author.username;
        var avatarURL = msg.author.avatarURL
        var authorId = msg.author.id;
        if (imgUrl.slice(imgUrl.length - 3) == "png" || imgUrl.slice(imgUrl.length - 3) == "jpg") {
            checkSubmission(msg);
            makeEmbed(msg, username, avatarURL, authorId, imgUrl, fileName, disc);
        } else {
            msg.channel.send("**This file format is unsupported.** Please use .png or a .jpg").then(botMsg => {
                deleteMsg(botMsg, 5000);
            }).catch();
            deleteMsg(msg, 100);
        };
    } else {
        msg.channel.send("**Please include an image to your message**").then(botMsg => {
            deleteMsg(botMsg, 5000);
        });
        deleteMsg(msg, 100);
    };
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

function makeEmbed(userMsg, username, avatarURL, authorId, url, fileName, disc) {
    msgEmbed = {
        embed: {
            color: 3447003,
            author: {
                name: username,
                icon_url: avatarURL
            },
            title: fileName,
            description: disc,
            thumbnail: {
                url: avatarURL
            },
            url: url,
            footer: {
                text: `Wallpaper Bot ${version}`
            },
            image: {
                url: url
            },
            fields: [{
                name: "Creator:",
                value: `<@${authorId}>`
            }],
        }
    }

    userMsg.channel.send(msgEmbed).then(message => {
        message.react("👍");
        // deleteMsg(msg, 100);
    });
}

function refreshList(subMessage, userMsg) {
    if (subMessage.embeds[0]) {
        var EmbededMsg = subMessage.embeds[0];
        var authorId = EmbededMsg.fields[0].value;
        authorId = authorId.replace(/\D/g,'');
        var avatarURL = EmbededMsg.thumbnail.url;
        var username = EmbededMsg.author.name;
        makeEmbed(userMsg, username, avatarURL, authorId, EmbededMsg.url, EmbededMsg.title, EmbededMsg.description);
        deleteMsg(subMessage, 0);
    }
}

function checkSubmission(msg) {
    var imageCount = 0;
    data.servers.forEach(server => {
        if (server.id == msg.guild.id) {
            if (msg.channel.id == server.channel.id) {
                msg.channel.fetchMessages({ limit: 100 }).then(messages => {
                    messages.forEach(message => {
                        if (message.attachments.size > 0 && message.author.id == msg.author.id ) {
                            imageCount++;
                            if (imageCount > 1) {
                                deleteMsg(message, 0);
                            }
                        }

                        if (message.embeds[0] && message.embeds[0].fields[0].value.search(msg.author.id) > -1) {
                            deleteMsg(message, 0);
                        } else {
                            refreshList(message, msg);
                        };
                    });
                });
                return;
            };
            return;
        };
    });

}

function deleteMsg(msg, delay) {
    data.servers.forEach(server => {
        if (server.id == msg.guild.id) {
            if (msg.channel.id == server.channel.id) {
                msg.delete(delay).catch(err => {
                    console.log(`Missing MANAGE_MESSAGES permissions to delete ${msg.author.username}'s message`);
                    console.log(err);
                });
            };
        };
    });
}

client.login(process.env.BOT_TOKEN);