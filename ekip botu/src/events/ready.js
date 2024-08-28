const { ActivityType, Events } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const ayarlar = require('../ayarlar.json');

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    const rest = new REST({ version: "10" }).setToken(client.token);
    client.log(`${client.user.username} Aktif Edildi!`);

    try {
      await rest.put(Routes.applicationCommands(client.user.id), {
        body: client.slashdatas,
      });
    } catch (error) {
      console.error(error);
    }

    // Bot hazır olduğunda durumu ayarla
    client.user.setActivity("Asl Bot's", { 
      type: ActivityType.Streaming, 
      url: "https://www.twitch.tv/aslxnn333" 
    });
  }
};
