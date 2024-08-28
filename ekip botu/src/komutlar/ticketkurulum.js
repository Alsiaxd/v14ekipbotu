const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, PermissionsBitField, ButtonStyle } = require('discord.js');
const ayarlar = require('../ayarlar.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketkurulum')
    .setDescription('Ticket Oluşturulacak Embedi Atar.'),
  async run(client, interaction) {

    const yetkiliRolID = ayarlar.Yetkiler.yetkili;
    const authorURL = ayarlar.Resimler.moderasyonURL;
    const guildIconURL = ayarlar.Resimler.moderasyonURL;

    const kullaniciRolleri = interaction.member.roles.cache;

    const yetkiliMi = ayarlar.Yetkiler.Staff.some(rolID => kullaniciRolleri.has(rolID));
    const admin = interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles);

    if (!yetkiliMi && !admin) {        
      const uyarı = new EmbedBuilder()
        .setColor('000080')
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
        .setDescription('・ Uyarı: Yetersiz veya geçersiz yetki.')
        .setTimestamp();
    
      return interaction.reply({
        embeds: [uyarı],
        ephemeral: true,
      });
    }

    const ticket = new EmbedBuilder()
      .setAuthor({ name: 'ʀᴇᴠᴇʀꜱᴇ ᴅᴇꜱᴛᴇᴋ ꜱɪ̇ꜱᴛᴇᴍɪ̇', iconURL: authorURL })
      .setDescription(`
        <a:utility:1233294337048051794> ・\`ᴅᴇꜱᴛᴇᴋ ꜱıꜱᴛᴇᴍı:・\`<:onday:1233294312046067712>
        <:8676gasp:1233279834600378441>・\` ᴅᴇꜱᴛᴇᴋ ʙıʟɢı:・\` <#1264293677090476143> 
      
        **<a:herzl:1233294281142439976>・\`ɢᴇɴᴇʟ ᴅᴇꜱᴛᴇᴋ:・\` Genel olarak desteğe ihtiyacınız varsa bu kategoriyi seçebilirsiniz.**
        **<a:5961darkbluetea:1233279709026975756>・\`ᴍᴜʟᴀᴋᴀᴛ ᴅᴇꜱᴛᴇᴋ:・\` Mülakat için bu kategoriyi seçebilirsiniz.**
        **<:kizgin:1233294288549580820>・\`ꜱɪᴋᴀʏᴇᴛ ᴅᴇꜱᴛᴇᴋ:・\` Şikayet için bu kategoriyi seçebilirsiniz.**
      `)
      .setColor('#000080')
      .setThumbnail('https://i.ibb.co/qkvSTgm/Ekran-g-r-nt-s-2024-07-20-191822.png')
      .setImage('https://i.ibb.co/qkvSTgm/Ekran-g-r-nt-s-2024-07-20-191822.png')
      .setFooter({
        text: 'ʀᴇᴠᴇʀꜱᴇ ᴅᴇꜱᴛᴇᴋ ꜱɪ̇ꜱᴛᴇᴍɪ̇',
        iconURL: guildIconURL
      });

    const buttonRow = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('genel')
          .setLabel('Genel Destek')
          .setEmoji('<a:herzl:1233294281142439976>')
          .setStyle(ButtonStyle.Primary), // ButtonStyle.Primary kullanıldı
        new ButtonBuilder()
          .setCustomId('mulakat')
          .setLabel('Mülakat Destek')
          .setEmoji('<a:5961darkbluetea:1233279709026975756>')
          .setStyle(ButtonStyle.Primary), // ButtonStyle.Primary kullanıldı
        new ButtonBuilder()
          .setCustomId('sikayet')
          .setLabel('Şikayet Destek')
          .setEmoji('<:kizgin:1233294288549580820>')
          .setStyle(ButtonStyle.Primary), // ButtonStyle.Primary kullanıldı
        new ButtonBuilder()
          .setCustomId('sifirla')
          .setLabel('Seçimi Sıfırla')
          .setEmoji('<:carpu:1233284105194442772>')
          .setStyle(ButtonStyle.Secondary) // ButtonStyle.Secondary kullanıldı
      );

    interaction.reply({ embeds: [ticket], components: [buttonRow] });

  },
};
