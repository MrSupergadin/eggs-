const Discord = require('discord.js');
const YTDL = require("ytdl-core");

var bot = new Discord.Client();
var prefix = ("$");
var servers = {};

bot.on('ready', () => {
    console.log("We are grilled vegetables is now online ! [Current version: 1.0.0] "); 
});

bot.login('NDU1MDUzMTM5Nzg4MzAwMjg5.Df7uKg.SB2b3jA7fa10v9IS8NdPG0AUt-M');

// Function

function play(connection, message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

    server.queue.shift();

    server.dispatcher.on("end", function() {
        if (server.queue[0]) play(connection, message);
        else connection.disconnect();
    });
}

// Message test : 

bot.on('message', message => {
    if (message.content === "$version"){
    message.reply(":white_check_mark:  `The bot is currently running on version 1.0.0.`");
    console.log('version [1.0.0]');
    }



    if (message.content === prefix + "command"){
        var help_embed = new Discord.RichEmbed()
        .setColor("#A4A4A4")
        .addField("**$command : **", "With this command you will discover the least secret ...")
        .addField("**$version : **", "Stay tuned for the latest version of our bot. The mechanic updates this message to each update of the bot.")
        .addField("**$the-vegetable-ban-1.2 : **", "Our engineers develop the ban-legume in order to exterminate the canibals.")
    message.channel.sendEmbed(help_embed);
    console.log("$command has been used ! We will not have done everything for nothing !");
    }
});

// YTB Bot 

bot.on("message", function(message) {
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(prefix)) return;

    var args = message.content.substring(prefix.length).split(" ");

    switch (args[0].toLowerCase()) {
        case "ping":
        message.channel.sendMessage("Pong!");
        break;
        case "play":
            if (!args[1]) {
                message.channel.sendMessage("Please provide a link");
                return;
            }

            if (!message.member.voiceChannel) {
                message.channel.sendMessage("You must be in a voice");
                return
            }

            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };

            var server = servers[message.guild.id];
            
            server.queue.push(args[1]);

            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                play(connection, message);
            });
            break;
        case "skip":
            var server = servers[message.guild.id];

            if (server.dispatcher) server.dispatcher.end();
            break;
        case "stop":
            var server = servers[message.guild.id];
            
            if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
            break; 
        default:
            message.channel.sendMessage(":x: `Invalid Command`");
        }
    });
