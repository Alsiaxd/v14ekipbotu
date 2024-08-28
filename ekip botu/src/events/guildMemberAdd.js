const { ActivityType, Events } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const ayarlar = require('../ayarlar.json');
const canvafy = require("canvafy")

module.exports = {
  name: Events.GuildMemberAdd,
  once: true,
  async execute(member) {
    const guild = member.guild;
    const welcome1 = await new canvafy.WelcomeLeave()
    .setAvatar(member.user.displayAvatarURL({ forceStatic: true, extension: "png" }))
    .setBackground("image", "https://i.ibb.co/qkvSTgm/Ekran-g-r-nt-s-2024-07-20-191822.png")
    .setTitle(member.user.username)
    .setDescription("Reverse  Adresine Hoşgeldin")
    .setBorder("#141212")
    .setAvatarBorder("#141212")
    .setOverlayOpacity(0.6)
    .build();


    const logChannel = member.guild.channels.cache.get(`1264290815761584370`);

    await logChannel.send({ 
        content: ` <a:onys:1233294313535049779> ・ Sunucuya Giriş Yaptı: ${member} `,
        files: [{
        attachment: welcome1,
        name: `saviour-${member.id}.png`
    }]});


  }
};
