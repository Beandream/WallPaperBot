
const Discord = require('discord.js');
const client = new Discord.Client();
var key = require("./Key.js");
 
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.isMemberMentioned(client.user)){  
    var str = (msg.content);
    var hi = str.search('hi'||'Hi'||'HI');
    var help = str.search('help'||'Help'||'HELP');
    var submit = str.search('submit'||'Enter'||'Submit');
    if(hi > -1){
      msg.channel.send(`Hello, ${msg.author.username}!`);
      return;
    };
    if(help > -1){
      msg.channel.send('**hi**- hello there \n**help**- for help \n**Submit**- To submit an Image to the Comp: Include an Image to your message.');
      return;
    };
    if (submit > -1){
      if (msg.channel.id == '442805569485537290'){
        var submitError = -1;
        let attachArray = Array.from(msg.attachments.values()); 
        attachArray.forEach(att => {
          if(att.height > 0){
            var textChannel = msg.guild.channels.find("name", "a");
            textChannel.fetchMessages().then(messages =>{
              let messageArray = Array.from(messages);
              messageArray.forEach((Arraycontent) =>{
                var msgSplit = Arraycontent[Arraycontent.length -1 ];
                if (msgSplit.content.search(msg.author) > -1){
                  submitError = 1;
                };
              })
              if (submitError < 1){
                textChannel.send(`<@${msg.author.id}>`);
                textChannel.send(att.url);
                msg.channel.send('**Image Succesfully Submitted**');
                submitError = -1;
                return;
              }
              msg.channel.send('**Error**-You Already Submitted An Image');
            });
          }; 
        });
        if (!attachArray.length){
          msg.channel.send('Please Submit An Image');  
        }; 
      };
      if (msg.channel.id !== '442805569485537290'){
        msg.delete(0, 1);
        var txtChannel = msg.guild.channels.find("name", "generalchat");
        msg.channel.send(`Please take this to ${txtChannel}, ${msg.author.username}!`).then (Mymsg => {
          Mymsg.delete(5000);
        });
      };
    };
  };
});
 
client.login(key);
