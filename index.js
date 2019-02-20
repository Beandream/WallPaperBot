const Discord = require('discord.js');
const client = new Discord.Client();
const data = require("./data.json");

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('error', err => { console.log(err) });

client.on('message', msg => {
    if (msg.isMemberMentioned(client.user)) {
        var str = msg.content.toUpperCase();
        var help = str.search('HELP');
        var hi = str.search('HI');
        var submit = str.search('SUBMIT');
        var disc = str.search('!');
        var del = str.search('DELETE');
        var delAll = str.search('DELALL');

        if (submit > -1) {
            if (msg.content.length - submit + 6 > 0 && disc > submit) {
                getDisc(msg, disc);
            } else {
                getImg(msg);
            }

        }
        else if (help > -1) {
            msg.channel.send({
                embed: {
                    color: 13508897,
                    author: {
                        name: "WallpaperBot",
                        icon_url: "https://cdn.discordapp.com/attachments/442805569485537290/538882719451709441/wallpaperBot2.png"
                    },
                    thumbnail: {
                        url: "https://cdn.discordapp.com/attachments/442805569485537290/538882719451709441/wallpaperBot2.png"
                    },
                    title: "**Commands**",
                    footer: {
                        text: 'Wallpaper Bot V2.0'
                    },
                    fields: [
                        {
                            name: "Help",
                            value: "A list of commands. ```@wallpaperbot Help``` "
                        },
                        {
                            name: "Hi",
                            value: "Hello There! ```@wallpaperbot Hi``` "
                        },
                        {
                            name: "Submit",
                            value: "Submit an image to the wallpaper comp. Make sure to include an image as an attachment to your message. ```@wallpaperbot Submit``` "
                        },
                        {
                            name: "Submit !",
                            value: "Ability to add a description to your submission. Anything afer the exclamation point will be your description. ```@wallpaperbot Submit !This is a sample description! :)``` "
                        },
                        {
                            name: "Delete",
                            value: "Deletes your current submission. ```@wallpaperbot Delete``` "
                        }
                    ],
                }
            })
        }
        else if (hi > -1) {
            msg.channel.send(`Hello, ${msg.author}`);
        }
        else if (del > -1) {
            delMsg(msg);
        }
        else if (delAll > -1) {
            let powerPerm = false;
            data.powerUsers.forEach(powerUser => {
                if (msg.author.id == powerUser.id) {
                    powerPerm = true;
                    delAllSubmits(msg);
                }
            });
            if (!powerPerm) {
                msg.channel.send("You do not have permission to use this command.")
            };
        }
        else {
            msg.channel.send('Use "@wallpaperbot help" for a list of commands');
        };
    }
})

function delMsg(msg) {
    let i = false;
    data.servers.forEach(server => {
        if (server.id == msg.guild.id) {
            msg.guild.channels.forEach(channel => {
                if (channel.id == server.channels.collectionChannel.id) {
                    channel.fetchMessages({ limit: 100 }).then(messages => {
                        messages.forEach(message => {
                            if (message.embeds[0]) {
                                if (message.embeds[0].fields[0].value.search(msg.author.id) > -1) {
                                    message.delete();
                                    msg.channel.send("**Submission deleted!**");
                                    i = true;
                                }
                            }
                        });
                    });
                    if (i == false){
                        msg.channel.send("**Error**- Could not find any submission.");
                    };
                    return;
                };
            });
            return;
        }
    })
}

function delAllSubmits(msg) {
    data.servers.forEach(server => {
        if (server.id == msg.guild.id) {
            msg.guild.channels.forEach(channel => {
                if (channel.id == server.channels.collectionChannel.id) {
                    channel.fetchMessages({ limit: 100 }).then(messages => {
                        messages.forEach(message => {
                            if (message.author.id == client.user.id) {
                                message.delete();
                            }
                        });
                    });
                    return;
                };
            });
            return;
        }
    })
}

function getDisc(msg, discInit) {
    var disc = msg.content.slice(discInit + 1);
    if (disc.length < 401) {
        getImg(msg, disc);
    } else {
        msg.channel.send("**Your description is too long.** Limit: 400 characters")
    }

}

function getImg(msg, disc) {
    if (msg.attachments.size > 0) {
        let attachArray = Array.from(msg.attachments.values());
        var imgUrl = attachArray[0].url
        var fileName = attachArray[0].filename
        if (imgUrl.slice(imgUrl.length - 3) == "png" || imgUrl.slice(imgUrl.length - 3) == "jpg") {
            makeEmbed(msg, imgUrl, fileName, disc);
        } else {
            msg.channel.send("**This file format is unsupported.** Please use .png or a .jpg");
        };
    } else {
        msg.channel.send("**Please an include image to your message**");
    };
}

function makeEmbed(msg, url, fileName, disc) {
    msgEmbed = {
        embed: {
            color: 3447003,
            author: {
                name: msg.author.username,
                icon_url: msg.author.avatarURL
            },
            title: fileName,
            description: disc,
            thumbnail: {
                url: msg.author.avatarURL
            },
            url: url,
            footer: {
                text: 'Use "@wallpaperbot help" for more info'
            },
            image: {
                url: url
            },
            fields: [{
                name: "Creator:",
                value: `<@${msg.author.id}>`
            }],
        }
    }

    let idGuildMatch = false;
    let idChannelMatch = false;
    let alreadySubmit = false;
    data.servers.forEach(server => {
        if (server.id == msg.guild.id) {
            msg.guild.channels.forEach(channel => {
                if (channel.id == server.channels.collectionChannel.id) {
                    channel.fetchMessages({ limit: 100 }).then(messages => {
                        messages.forEach(message => {
                            if (message.embeds[0]) {
                                if (message.embeds[0].fields[0].value.search(msg.author.id) > -1) {
                                    msg.channel.send("**Image not submitted** You already have an image submitted. Use Delete to remove your submission. ```@wallpaperbot delete```")
                                    alreadySubmit = true;
                                }
                            }
                        });
                        if (!alreadySubmit) {
                            channel.send(msgEmbed);
                            msg.channel.send("**Submission Successful!**")
                        };
                    });
                    idChannelMatch = true;
                    return;
                };
            });
            if (!idChannelMatch) {
                console.log("No channel ID's Matched! msgEmbed did not send");
                msg.channel.send("**It seems an error has occurred. please panic now. .NoChannel. ");
            }
            idGuildMatch = true;
            return;
        };
    });
    if (!idGuildMatch) {
        console.log("No Server ID's Matched! msgEmbed did not send");
        msg.channel.send("**It seems an error has occurred. please panic now. .NoServer.");
    }
}

client.login(process.env.BOT_TOKEN);