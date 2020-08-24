const Discord = require('discord.js');
const client = new Discord.Client
module.exports = {
    name: 'avatar',
    execute(message, args){
        const embed = new Discord.MessageEmbed()
        .setTitle('Your avatar!')
        .setThumbnail(message.author.displayAvatarURL())
        .setColor(0x7f32a8);
         message.channel.send(embed);
    }
}