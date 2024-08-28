const { Client, Collection, Events, GatewayIntentBits, Partials } = require('discord.js');
const client = global.client = new Client({
  intents: [
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.AutoModerationExecution,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.GuildMember,
    Partials.Reaction,
    Partials.GuildScheduledEvent,
    Partials.User,
    Partials.ThreadMember
  ],
  shards: 'auto'
});
const mongoose = require("mongoose");


mongoose.connect('mongodb+srv://aslan:aslan123321Ee@cluster0.7pg9fpo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
       })
.then(() => console.log("Mongo Bağlandı!"))
.catch(console.error);

const config = require('./config.js');
const { readdirSync } = require('node:fs');
const moment = require('moment');
const ayarlar = require('./ayarlar.json'); 

let token = config.token;
client.commandaliases = new Collection();
client.commands = new Collection();
client.slashcommands = new Collection();
client.slashdatas = [];

function log(message) {
  console.log(`[${moment().format('DD-MM-YYYY HH:mm:ss')}] ${message}`);
};
client.log = log;

const slashcommands = [];
readdirSync('./komutlar').forEach(async (file) => {
  const command = await require(`./komutlar/${file}`);
  if (command.data) {
    client.slashdatas.push(command.data.toJSON());
    client.slashcommands.set(command.data.name, command);
  } else {
    console.error(`Error loading command from file ${file}: 'data' is undefined`);
  }
});

readdirSync('./events').forEach(async (file) => {
  const event = await require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
});

process.on('unhandledRejection', (e) => {
  console.log(e);
});
process.on('uncaughtException', (e) => {
  console.log(e);
});
process.on('uncaughtExceptionMonitor', (e) => {
  console.log(e);
});

client.login(token);
