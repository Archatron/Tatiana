const Discord = require('discord.js')
const client = new Discord.Client({disableEveryone: true});
 const prefix = 'a!';
 const queue = new Map();
 const ytdl = require("ytdl-core");
 const fs = require('fs');
 var guildconf = require('./guildconf.json');
 const botsettings = require('./botsettings.json')
 client.commands = new Discord.Collection();
 const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith('.js'));

 const { error } = require('console');
client.once('ready', () => {
    console.log('This bot is online!');
    client.user.setActivity(client.guilds.cache.size + " servers", {type: "WATCHING"})
})

    for(const file of commandFiles) {
    const command = require(`./commands/${file}`)
    client.commands.set(command.name, command)
}
 
client.on('message', message => {
    let msg = message.content.toLowerCase();
    let args = message.content.substring(prefix.legnth).split(" ");

    if (!guildconf[message.channel.id]){
        guildconf[message.channel.id] = {
            prefix: 'a!'
        }
    }
    fs.writeFile('./guildConf.json', JSON.stringify(guildconf, null, 2), (err) =>{
        if (err) console.log(err);
    })
    if(msg.startsWith(guildconf[message.channel.id].prefix + 'prefix')){
        if (message.member.hasPermission("MANAGE_GUILD") || message.member.hasPermission('ADMINISTRATOR')){
        if(!args[1]){
            return message.channel.send('Please include new prefix.')
        }
        guildconf[message.channel.id].prefix = (args[1]).toLowerCase();
        fs.writeFile('./guildConf.json', JSON.stringify(guildconf, null, 2), (err) =>{
            if (err) console.log(err);
        })
        return message.channel.send(' The new prefix for this server is ' + (args[1]).toLowerCase() + '"')
    } else {
        return message.channel.send("You require the manage server perms to use this")
    }
    }
    if (msg.startsWith(guildconf[message.channel.id].prefix + 'kick')) {
      client.commands.get('kick').execute(message, args)
     }
     if (msg.startsWith(guildconf[message.channel.id].prefix + 'ban')) {
      client.commands.get('ban').execute(message, args)
     }
     if (msg.startsWith(guildconf[message.channel.id].prefix + 'help')){
        client.commands.get('help').execute(message, args)
    }
     if (msg.startsWith(guildconf[message.channel.id].prefix + 'invite')){
        client.commands.get('invite').execute(message, args)
    }
    if (msg.startsWith(guildconf[message.channel.id].prefix + 'music')){
        client.commands.get('music').execute(message, args)
    }
    if (msg.startsWith(guildconf[message.channel.id].prefix + 'avatar')){
        client.commands.get('avatar').execute(message, args)
    }
});

client.on('message', message => {
    let msg = message.content.toLowerCase();
    let args = message.content.substring(prefix.legnth).split(" ");

    if (!guildconf[message.channel.id]){
        guildconf[message.channel.id] = {
            prefix: 'a!'
        }
    }
    fs.writeFile('./guildConf.json', JSON.stringify(guildconf, null, 2), (err) =>{
        if (err) console.log(err);
    })
    if (msg.startsWith(guildconf[message.channel.id].prefix + 'rps')){
        client.commands.get('rps').execute(message, args)
    }
    if (msg.startsWith(guildconf[message.channel.id].prefix + '8ball')){
        client.commands.get('8ball').execute(message, args)
    }
    if (msg.startsWith(guildconf[message.channel.id].prefix + 'howgay')){
        client.commands.get('howgay').execute(message, args)
    }
    if (msg.startsWith(guildconf[message.channel.id].prefix + 'kill')){
        client.commands.get('kill').execute(message, args)
    }
})
client.once("reconnecting", () => {
    console.log("Reconnecting!");
  });
  
  client.once("disconnect", () => {
    console.log("Disconnect!");
  });
  
  client.on("message", async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
  
    const serverQueue = queue.get(message.guild.id);
  
    if (message.content.startsWith(`${prefix}play`)) {
      execute(message, serverQueue);
      return;
    } else if (message.content.startsWith(`${prefix}skip`)) {
      skip(message, serverQueue);
      return;
    } else if (message.content.startsWith(`${prefix}stop`)) {
      stop(message, serverQueue);
      return;
    }
  });
  
  async function execute(message, serverQueue) {
    const args = message.content.split(" ");
  
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.channel.send(
        "You need to be in a voice channel to play music!"
      );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        "I need the permissions to join and speak in your voice channel!"
      );
    }
  
    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
      title: songInfo.title,
      url: songInfo.video_url
    };
  
    if (!serverQueue) {
      const queueContruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true
      };
  
      queue.set(message.guild.id, queueContruct);
  
      queueContruct.songs.push(song);
  
      try {
        var connection = await voiceChannel.join();
        queueContruct.connection = connection;
        play(message.guild, queueContruct.songs[0]);
      } catch (err) {
        console.log(err);
        queue.delete(message.guild.id);
        return message.channel.send(err);
      }
    } else {
      serverQueue.songs.push(song);
      return message.channel.send(`${song.title} has been added to the queue!`);
    }
  }
  
  function skip(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You have to be in a voice channel to stop the music!"
      );
    if (!serverQueue)
      return message.channel.send("There is no song that I could skip!");
    serverQueue.connection.dispatcher.end();
  }
  
  function stop(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You have to be in a voice channel to stop the music!"
      );
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
  }
  
  function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }
  
    const dispatcher = serverQueue.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
      })
      .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
  }
  
client.login(process.env.token);
