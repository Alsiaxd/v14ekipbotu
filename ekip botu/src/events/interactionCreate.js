const { Events, InteractionType, ButtonStyle, PermissionsBitField, ChannelType } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  execute: async (interaction) => {
    let client = interaction.client;

    if (interaction.type === InteractionType.ApplicationCommand) {
      if (interaction.user.bot) return;
      try {
        const command = client.slashcommands.get(interaction.commandName);
        if (command) {
          command.run(client, interaction);
        }
      } catch (e) {
        console.error(e);
        await interaction.reply({
          content: 'Komut çalıştırılırken bir sorunla karşılaşıldı! Lütfen tekrar deneyin.',
          ephemeral: true,
        });
      }
    } else if (interaction.isButton()) {
      const { customId } = interaction;

      if (customId === 'genel') {
        await interaction.reply('Genel Destek kanalı oluşturuluyor...');

        const channel = await interaction.guild.channels.create({
          name: 'genel-destek',
          type: ChannelType.GuildText,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [PermissionsBitField.Flags.SendMessages],
            },
            {
              id: interaction.user.id,
              allow: [PermissionsBitField.Flags.SendMessages],
            },
          ],
        });

        await interaction.followUp(`Genel Destek kanalı başarıyla oluşturuldu: <#${channel.id}>`);
      } else if (customId === 'mulakat') {
        await interaction.reply('Mülakat Destek kanalı oluşturuluyor...');

        const channel = await interaction.guild.channels.create({
          name: 'mulakat-destek',
          type: ChannelType.GuildText,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [PermissionsBitField.Flags.SendMessages],
            },
            {
              id: interaction.user.id,
              allow: [PermissionsBitField.Flags.SendMessages],
            },
          ],
        });

        await interaction.followUp(`Mülakat Destek kanalı başarıyla oluşturuldu: <#${channel.id}>`);
      } else if (customId === 'sikayet') {
        await interaction.reply('Şikayet Destek kanalı oluşturuluyor...');

        const channel = await interaction.guild.channels.create({
          name: 'sikayet-destek',
          type: ChannelType.GuildText,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [PermissionsBitField.Flags.SendMessages],
            },
            {
              id: interaction.user.id,
              allow: [PermissionsBitField.Flags.SendMessages],
            },
          ],
        });

        await interaction.followUp(`Şikayet Destek kanalı başarıyla oluşturuldu: <#${channel.id}>`);
      } else if (customId === 'sifirla') {
        await interaction.reply('Seçim sıfırlanıyor...');
        // Bu işlem için gerekli olan kodu buraya ekleyin.
      }
    } else if (interaction.isContextMenuCommand()) {
      const { commands } = client;
      const { commandName } = interaction;
      const contextCommand = commands.get(commandName);
      if (!contextCommand) return;

      try {
        await contextCommand.execute(interaction, client);
      } catch (error) {
        console.error(error);
      }
    }
  },
};
