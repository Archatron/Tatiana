const Discord = require('discord.js');
const client = new Discord.Client
module.exports = {
    name: 'help',
    execute(message, args){
        const embed = new Discord.MessageEmbed()
        .setTitle('🛠Commands')
        .addField('⛓General', `a!purge - deletes the amount of messages you choose(below 100)`)
        .addField('⚙Moderate', `a!ban - Bans a server member.\na!kick - Kicks a server member`)
        .addField('🏓Fun', `a!rps - a game of rock paper scissors\na!8ball - ask away your questions\na!howgay - decides the rate for you or your friend!\na!kill - kill whoever you mention`)
        .addField(`♫Music`, `a!music - Music Commands!`)
        .addField(`Help`, `a!help - Shows this message\na!prefix - Changes the bots prefix`)
        .setColor(0x7f32a8);
         message.channel.send(embed);
    }
}