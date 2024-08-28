const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ChannelType, Permissions } = require('discord.js');
const ayarlar = require('../ayarlar.json');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticketisim')
        .setDescription(' Ticket İsmini Degiştirmenize Yardımcı Olur')
        .addStringOption(option =>
            option.setName('isim')
                .setDescription('Yapmak istediğiniz isimi yazınız!')
                .setRequired(true)
        ),
    async run(client, interaction) {
        const newChannelName = interaction.options.getString('isim');

        const targetCategoryID = ayarlar.parentCategory;


        const channel = interaction.channel;
        if ((ChannelType.GuildCategory && channel.parentId === targetCategoryID)) {
            const oldChannelName = channel.name;
            channel.setName(newChannelName);

            const embed = new EmbedBuilder()
                .setColor('#3498db')
                .setAuthor({
                    name: `${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL(),
                })
                .setDescription(`<#${channel.id}>, <a:5961darkbluetea:1233795662949388380> *isimli kanalın ismi* \`${oldChannelName}\` *iken* \`${newChannelName}\` *olarak güncellenmiştir.*`);

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            await interaction.reply({ content: 'Bu komut sadece belirli bir kategori altındaki metin kanallarında kullanılabilir.', ephemeral: true });
        }
    },
};
