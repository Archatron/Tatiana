const Discord = require('discord.js');
const client = new Discord.Client
module.exports = {
    name: 'music',
    execute(message, args){
        const embed = new Discord.MessageEmbed()
        .setTitle('🛠Commands')
        .addField('♫Music', `a!play - plays the youtue url you send\na!stop - stops the song playing`)
        .setColor(0x7f32a8);
         message.channel.send(embed);
    }
}