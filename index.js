
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
    var search = str.search('search');
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
    if(search > 0){
      var textChannel = msg.guild.channels.find("name", "generalchat"); 
      //console.log(textChannel);
      textChannel.fetchMessages().then(messages => {
        var filteredMsgCollection = messages.filter(msg =>{
          if (msg.isMemberMentioned(client.user)){  
            let firstAttchmentArray = Array.from(msg.attachments.values());           
            return msg.content.search("hi") !== -1 && firstAttchmentArray.length > 0
          };
        })
        var messageArray = filteredMsgCollection.array();

        messageArray.forEach(message => {
          let attachArray = Array.from(message.attachments.values()); 

          attachArray.forEach(att => {
            if(att.height > 0){
              msg.channel.send(`found image`);
              msg.channel.send(att.url);
            }
          })

        })
        msg.channel.send(`found ${messageArray.length} messages with the word hi`)
      }).catch(console.error);
    };
  };
  console.log(msg.guild.available); 
});
 
client.login(key);