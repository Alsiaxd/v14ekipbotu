const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, AttachmentBuilder } = require('discord.js');
const ayarlar = require('../ayarlar.json');
const canvafy = require("canvafy");
const moment = require("moment");

require("moment-duration-format")
moment.locale("tr")
module.exports = {
  name: 'guildMemberRemove',
  async execute(member) {
    const guild = member.guild;
    const logChannel = member.guild.channels.cache.get(`1264290815761584370`);
    const welcome = await new canvafy.WelcomeLeave()
      .setAvatar(member.user.displayAvatarURL({ forceStatic: true, extension: "png" }))
      .setBackground("image", "https://i.ibb.co/qkvSTgm/Ekran-g-r-nt-s-2024-07-20-191822.png")
      .setTitle(member.user.username)
      .setDescription(`Çıkış Tarihi: ${moment(Date.now()).format("LLL")}`)
      .setBorder("#141212")
      .setAvatarBorder("#141212")
      .setOverlayOpacity(0.6)
      .build();

    logChannel.send({
      content: `<a:reds:1233294322003218484>・ *Sunucudan Çıkış Yaptı:* ${member}`,
        files: [{
        attachment: welcome,
        name: `saviour-${member.id}.png`
      }]
    })


  }
}