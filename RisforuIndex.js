const { colors, icons } = require('././RisforuEvents/Options.json');
const { Client, Collection, MessageEmbed } = require('discord.js');
const { config } = require('dotenv');
const { prefix } = require('./RisforuConfig.json');
const disbut = require('discord-buttons');

const cooldown = new Set();

const client = new Client({
  disableEveryone: true
});

disbut(client)
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.sendStatus(200);
});

app.listen(process.env.PORT);

client.cooldown = new Collection();
client.collector = new Collection();
client.commands = new Collection();
client.aliases = new Collection();

client.queue = new Map();

['command'].forEach(handler => {
  require(`./RisforuCommandHandlers/${handler}`)(client);
});

client.queue = new Map()
process.on('UnhandledRejection', console.error);

client.snipes = new Map();
client.on('messageDelete', function(message, channel) {
  client.snipes.set(message.channel.id, {
    content: message.content,
    author: message.author.tag,
    icon: message.author.displayAvatarURL(),
    image: message.attachments.first()
      ? message.attachments.first().proxyURL
      : null
  });
});

client.on('ready', () => {
  client.user.setActivity('@mention', {
    type: 'LISTENING'
  });
  console.log(`${client.user.tag}: Wangsaf!`);
});

client.on('message', async message => {
  
  const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
  if (message.content.match(prefixMention)) {
    const EmbedHello = new MessageEmbed()
    .setColor(colors.main)
    .setAuthor(`Hello ${message.author.tag}, getting started with me?`, message.author.displayAvatarURL())
    .setDescription(`Use the prefix [\`!\`] to trigger the command.\nType [\`!command-list\`] to display all the commands per categories.`)
    .setFooter('*Default prefix cannot be customizable')
    return message.channel.send(EmbedHello)
  }
  
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.startsWith(prefix)) return;

  if (!message.member)
    message.member = await message.guild.fetchMember(message);

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  let command = client.commands.get(cmd);
  if (!command) command = client.commands.get(client.aliases.get(cmd));
  if (command) command.run(client, message, args);  
});

client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
  if (!channel) return;
  channel.send(`Welcome to the server, ${member}`);
});

client.login(process.env.KEY);
