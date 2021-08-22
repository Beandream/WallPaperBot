const fetch = require("node-fetch");
const Discord = require('discord.js');
const client = new Discord.Client();
const Data = require("./data.json");
const version = "v6.0";

const imageChannels = [];
const videoChannels = [];
Data.servers.forEach(s => {
    imageChannels.push(s.imageChannel.id);
});
Data.servers.forEach(s => {
    videoChannels.push(s.videoChannel.id);
});


client.on('ready', () => { console.log(`Logged in as ${client.user.tag}!`) });
client.on('error', err => { console.log(err) });

client.on('message', msg => {
    if (msg.author.bot) return;

    if (msg.isMemberMentioned(client.user)) {
        checkCmd(msg);
    }
    if (imageChannels.includes(msg.channel.id)) {
        let timeWait = setTimeout(checkMsg, 1000); //wait until discord auto embeds video
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

function isVideo(msg) {
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

function isImage(msg) {
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
    var upload = str.search('UPLOAD');

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
    } else if (upload > -1 && isAdmin(msg)) {
        uploadSubmissions(msg); //uploads submissions to external app
    } else if (reset > -1 && isAdmin(msg)) {
        if (videoChannels.includes(msg.channel.id) || imageChannels.includes(msg.channel.id)) {
            deleteAll(msg);
        }
    }
}

function isAdmin(msg) {
    if (Data.admins.find(a => a.id === msg.author.id)) {
        return true
    }
}

function uploadSubmissions(msg) {
    console.log("attemping to upload data");
    if (imageChannels.includes(msg.channel.id)) {
        uploadImages(msg);
    } else if (videoChannels.includes(msg.channel.id)) {
        uploadVideos(msg);
    } else {
        console.log(`Upload Command does not work in channel with id: ${msg.channel.id}`)
    }

    function uploadImages(msg) {
        let images = [];
        msg.channel.fetchMessages({ limit: 100 }).then(messages => {
            messages.forEach(message => {
                if (isImage(message)) {
                    let image = getUrl(message);
                    let name = message.author.username;
                    images.push({ url: image, text: name });
                }
            });
            uploadData(images);
        });

    }

    function uploadVideos() {
        let videos = [];
        msg.channel.fetchMessages({ limit: 100 }).then(messages => {
            messages.forEach(message => {
                if (isVideo(message)) {
                    let image = getUrl(message);
                    let name = message.author.username;
                    images.push({ url: image, text: name });
                }
            });
            uploadData(videos);
        });
    }

    function getUrl(msg) {
        if (msg.attachments.size > 0) {
            let attachArray = Array.from(msg.attachments.values());
            let url = attachArray[0].url;
            return url;
        }
    }

    function uploadData(data) {
        console.log(data.length);
        // uploads images to my multiplayer veiwing app.
        fetch('https://bd-socketio.glitch.me/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.text())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
}

function deleteAll(msg) {
    Data.servers.forEach(server => {
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
    Data.servers.forEach(server => {
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