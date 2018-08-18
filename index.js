
const Discord = require('discord.js');
const client = new Discord.Client();
var delAllConfirm = false;
// var key = require("./Key.js");
 
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('error', err => {console.log(err)});
client.on('reconnecting', rcnct => {console.log('I am officially Trying to Reconnect')});

client.on('message', msg => {
 try {
   if (msg.isMemberMentioned(client.user)){  
    var str = msg.content.toUpperCase();
    var hi = str.search('HI');
    var help = str.search('HELP');
    var submit = str.search('SUBMIT');
    var deletemsg = str.search('DELETE');
    if (msg.author.id == '284924421892734977' || msg.author.id == '277203191924391946'){
      var delAll = str.search('DELETEALL');
      var delConfirm = str.search('CONFIRM');
    }
    if(hi > -1){
      msg.channel.send(`Hello, ${msg.author.username}!`);
      return;
    };
    if(help > -1){
      msg.channel.send('**hi**- hello there. :wave: \n**help**- Commands list. \n**Submit**- To submit an Image to the Comp: Include an Image to your message.\n**Delete**- To remove an image that you submitted.');
      return;
    };
    if (submit > -1){
      submitMsg(msg);
      return;
    };
    if (delAll > -1 && delConfirm < 0){
      msg.channel.send(`Are You Sure you want to **delete** all messages from #wallpaperbot? \n **"DeleteAll Confirm" to confirm**`);
      delAllConfirm = true;
      return;
    }
    else if (delAll > -1 && delConfirm > -1 && delAllConfirm == true){
      deleteAll(msg);
      delAllConfirm = false;
      return;
    }
    else {
      delAllConfirm = false;
    };
    if (deletemsg > -1){
      msgDel(msg);
      return;
    };
    msg.channel.send('Say ***@WallPaperBot help***, for more info.')
  };
 } catch (error){
  console.log(error);
 }
});

function deleteAll(msg){
  var txtchnl = msg.guild.channels.find('name', 'wallpaperbot');
  var msgsDeleted;
  txtchnl.fetchMessages({ limit: 100 }).then(function (messages){
    messages.forEach(msgs => {
      msgs.delete();
      msgsDeleted++;
    });
  }).catch(console.error)
  msg.channel.send(`Deleted ${msgsDeleted} messages`);
};

function msgDel(msg){
  var txtchnl = msg.guild.channels.find('name', 'wallpaperbot');
  var msgDeleted = false;
  var msgImages;
  txtchnl.fetchMessages({ limit: 100 }).then(function (messages){
    messages.forEach(msgs => {
      if (msgs.content.search(msg.author.id)> -1){
        msgs.delete();
        msg.channel.send(`**Image successfully deleted**`);
        msgDeleted = true;
      };
    })
    if (msgDeleted == false){
      console.log('Failure to Find Message With that @mention Id, is there more than 100 messages?');
      msg.channel.send("Sorry I could not delete your image, Do you have one Submitted?");
    }
  }).catch(console.error)
}

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
              textChannel.send(`<@${msg.author.id}> ${att.url}`);
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

