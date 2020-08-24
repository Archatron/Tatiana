const Discord = require('discord.js');
const client = new Discord.Client
module.exports = {
    name: 'purge',
    execute(message,  args){
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.send("You can't use this command!");
    if(!args[0]) return message.channel.send("Specify how many messages you want to delete.");
    message.delete();
    message.channel.bulkDelete(args[0]).catch(e => { message.channel.send("You can only delete 100 messages at once.")});
    message.channel.send(`Succesfuly deleted \` ${args[0]} messages\``).then(m => message.delete({ timeout: 5000}));
    }
}