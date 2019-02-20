const Discord = require('discord.js');
const client = new Discord.Client();
 
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('error', err => {console.log(err)});

client.on('message', msg => {
  if (msg.isMemberMentioned(client.user)){  
    var str = msg.content.toUpperCase();
    var hi = str.search('HI');
    if (hi){
      // console.log(msg.attachments[0].url);
      // var embed = new Discord.RichEmbed()
      //   .setTitle('A title for "Hi"')
      //   .setColor(0xFF0000)
      //   .setDescription('Hello Discription')
      //   .setImage(msg.attachments)

      msg.channel.send('``Agree`` ``-`` ``Cancel``').then(function(msgReact) {
        msgReact.react('✅').then(() => {
          msgReact.react('⛔').then(() =>{
            awaitReacts(msgReact, msg);
          });
        });
      });
    }
  }
})

function awaitReacts(botMsg, userMsg){

  const filter = (reaction, user) => {
    return ['✅', '⛔'].includes(reaction.emoji.name) && user.id === userMsg.author.id;
  };

  botMsg.awaitReactions(filter, { max: 1, time: 60000, errors: ['timed-out'] })
    .then(collected => {
      const reaction = collected.first();

      if (reaction.emoji.name === '✅') {
        userMsg.reply('**Agreed**.');
      }
      else {
        userMsg.reply('**Canceled**.');
      }
    })
    .catch(collected => {
      console.log(`After a minute, only ${collected.size} Reacted.`);
      botMsg.clearReactions();
      botMsg.edit("**Timed Out**").catch(console.error);
    });

}

client.login('NDMzNzY0NjEwMTE0MzIyNDUy.DphH0w.Sy9V82C5WbiUsMLvMHsSQ_Zjz0I');