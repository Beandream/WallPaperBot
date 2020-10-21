const Discord = require('discord.js');
const client = new Discord.Client();
const data = require("./data.json");
const version = "v5.2";

const imageChannels = [];
const videoChannels = [];
data.servers.forEach( s => {
    imageChannels.push(s.imageChannel.id);
});
data.servers.forEach( s => {
    videoChannels.push(s.videoChannel.id);
});


client.on('ready', () => {console.log(`Logged in as ${client.user.tag}!`)});
client.on('error', err => { console.log(err) });

client.on('message', msg => {
    if (msg.author.bot) return;
    
    if (msg.isMemberMentioned(client.user)) {
        checkCmd(msg);
    }
    if (imageChannels.includes(msg.channel.id)) {
        let timeWait =  setTimeout(checkMsg, 1000); //wait until discord auto embeds video
        function checkMsg() {
            if (isImage(msg)) { // if msg is a image in the image submission channel
                cleanChannel(msg, 'IMAGE');
            }
        }
    } else if (videoChannels.includes(msg.channel.id)) {
        let timeWait = setTimeout(checkMsg, 1000); //wait until discord auto embeds video
        function checkMsg() {
            if (isVideo(msg)) { // if msg is a video in the video submission channel
                cleanChannel(msg, 'VIDEO');
            }
        }
    }
})

function cleanChannel(msg, type, cmd) { // removes all none submission messages from the submission channel
    if (type == 'VIDEO') { 
        msg.channel.fetchMessages({ limit: 100 }).then(messages => { 
            messages.forEach(message => {
                if (!isVideo(message)) { // delete all non-video messages
                    deleteMsg(message, 0);
                } else if (message.id != msg.id && message.author.id == msg.author.id && !cmd) {
                    deleteMsg(message, 0);
                }
            });
        });
    } else if (type == 'IMAGE') { 
        msg.channel.fetchMessages({ limit: 100 }).then(messages => { 
            messages.forEach(message => {
                if (!isImage(message)) { // delete all non-image messages
                    deleteMsg(message, 0);
                } else if (message.id != msg.id && message.author.id == msg.author.id && !cmd) {
                    deleteMsg(message, 0);
                }
            });
        });
    };
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
        }
    }
}

function isImage (msg) {
    if (msg.embeds[0]) {
        if (msg.embeds[0].type == 'image') {
            return true;
        }
    } else if (msg.attachments.size > 0) {
        let attachArray = Array.from(msg.attachments.values());
        let url = attachArray[0].url.toUpperCase();
        if (url.slice(url.length - 3) == "PNG" || url.slice(url.length - 3) == "JPG") {
            return true;
        }
    }
}

function checkCmd(msg) {
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
        if (imageChannels.includes(msg.channel.id)) {
            cleanChannel(msg, 'IMAGE', true)
        } else if (videoChannels.includes(msg.channel.id)) {
            cleanChannel(msg, 'VIDEO', true);
        } else {
            console.log(`Clean Command does not work in channel with id: ${msg.channel.id}`)
        }
    } else if (reset > -1) {
        if (videoChannels.includes(msg.channel.id) || imageChannels.includes(msg.channel.id)){
            data.mods.forEach(m => {
                if (m.id == msg.author.id) {
                    deleteAll(msg);
                }
            })
        }
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