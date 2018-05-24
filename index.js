
const Discord = require('discord.js');
const client = new Discord.Client();
// var key = require("./Key.js");
 
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.isMemberMentioned(client.user)){  
    var str = msg.content.toUpperCase();
    var hi = str.search('HI');
    var help = str.search('HELP');
    var submit = str.search('SUBMIT');
    if(hi > -1){
      msg.channel.send(`Hello, ${msg.author.username}!`);
      return;
    };
    if(help > -1){
      msg.channel.send('**hi**- hello there \n**help**- for help \n**Submit**- To submit an Image to the Comp: Include an Image to your message.');
      return;
    };
    if (submit > -1){
      submitMsg(msg);
      return;
    };
    msg.channel.send('Say ***@WallPaperBot help***, for more info.')
  };
});
 
function submitMsg(msg){
  if (msg.channel.id == "442805569485537290" || msg.channel.id == "296728093702488084"|| msg.channel.id == "296726106067828737"){
    var submitError = false;
    let attachArray = Array.from(msg.attachments.values()); 
    attachArray.forEach(att => {
      if(att.height > 0){
        var textChannel = msg.guild.channels.find("name", "wallpaperbot");
        if(textChannel){
          textChannel.fetchMessages().then(messages =>{
            let messageArray = Array.from(messages);
            messageArray.forEach((Arraycontent) =>{
              var msgSplit = Arraycontent[Arraycontent.length -1 ];
              if (msgSplit.content.search(msg.author) > -1){
                submitError = true;
              };
            })
            if (!submitError){
              textChannel.send(`<@${msg.author.id}>`);
              textChannel.send(att.url);
              msg.channel.send('**Image Succesfully Submitted**');
              return;
            }
            msg.channel.send('**Error**- You Already Submitted An Image');
          }).catch(error =>{
            console.log(error)
          });
        }else{
          console.log("Textchannel doesn't exsist");
        };
      }; 
    });
    if (!attachArray.length){
      msg.channel.send('Please include an Image in your message');  
    }; 
  }else {
    msg.delete();
    var txtChannel = msg.guild.channels.find("name", "stills");
    if (txtChannel){
      msg.channel.send(`Please take this to ${txtChannel}, ${msg.author.username}!`).then (Mymsg => {
        Mymsg.delete(5000);
      }).catch(error =>{
        console.log(error)
      });
    }else{
      console.log("#stills txtchannel doesn't exsist");
    };
  };
};

client.login(process.env.BOT_TOKEN);
