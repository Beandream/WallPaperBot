
const Discord = require('discord.js');
const client = new Discord.Client();
var key = require("./Key.js");
 
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.isMemberMentioned(client.user)){  
    var str = (msg.content);
    var hi = str.search('hi');
    var help = str.search('help');
    var ping = str.search('ping');
    if(hi > -1){
      msg.channel.send(`Hello, ${msg.author.username}!`);
      return;
    };
    if(help > -1){
      msg.channel.send('**help**- for help');
      msg.channel.send('**ping**- Responds Pong');
      return;
    };
    if(ping > -1){
      msg.channel.send('Pong');
      return;
    };
  };
  console.log(msg.guild.available); 
});
 
client.login(key);