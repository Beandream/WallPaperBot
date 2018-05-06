
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
            msg.channel.send('**Error**- Image Already Submitted');
          });
        }; 
      });
      if (!attachArray.length){
        msg.channel.send('Please Submit An Image');  
      }; 
    };
    // if(search > 0){
    //   var textChannel = msg.guild.channels.find("name", "generalchat"); 
    //   textChannel.fetchMessages().then(messages => {
    //     var filteredMsgCollection = messages.filter(msg =>{
    //       if (msg.isMemberMentioned(client.user)){
    //         let firstAttchmentArray = Array.from(msg.attachments.values());  
    //         return msg.content.search("hi") !== -1 && firstAttchmentArray.length > 0
    //       };
    //     })
    //     var messageArray = filteredMsgCollection.array();
    //     messageArray.forEach(message => {
    //       let attachArray = Array.from(message.attachments.values()); 
    //       attachArray.forEach(att => {
    //         if(att.height > 0){
    //           msg.channel.send(`found image`);
    //           msg.channel.send(att.url);
    //           msg.channel.send(msg.author.username);
    //         };
    //       })
    //     })
    //     msg.channel.send(`found ${messageArray.length} messages with the word hi`)
    //   }).catch(console.error);
    // };
  };
});
 
client.login(key);