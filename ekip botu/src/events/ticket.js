const { PermissionsBitField, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const ayarlar = require('../ayarlar.json');
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");

const categoryNames = {
    'genel': 'ɢᴇɴᴇʟ ᴅᴇꜱᴛᴇᴋ',
    'mulakat': 'ᴍᴜʟᴀᴋᴀᴛ ᴅᴇꜱᴛᴇᴋ',
    'sikayet': 'ꜱɪᴋᴀʏᴇᴛ ᴅᴇꜱᴛᴇᴋ',
    'bime': 'ꜱᴇᴄ̧ɪᴍ ꜱıꜰıʀʟᴀ'
};
const openTickets = new Map();
const takenOverUsers = new Map();
module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isStringSelectMenu()) return;

        const selectedCategory = interaction.values[0];
        const categoryName = categoryNames[selectedCategory];
        
        if (!categoryName) {
            return interaction.reply({
                content: '<:onday:1233294312046067712> ***Başarılı Bir Şekilde Seçim Sıfırlandı ***',
                ephemeral: true,
            });
        }

        const guild = interaction.guild;

        const parentCategory = ayarlar.parentCategory;

        if (!parentCategory) {
            return interaction.reply({
                content: 'Kategori bulunamadı!',
                ephemeral: true
            });
        }

        if (openTickets.has(interaction.user.id)) {
            return interaction.reply({
                content: '<a:warn:1233294338491154496> **Zaten Açık Bir Talebiniz Bulunmaktadır.** ',
                ephemeral: true,
            });
        }

        const existingTicket = guild.channels.cache.find(channel => {
            if (channel.type === ChannelType.GuildText) {
                const topic = channel.topic || '';
                const userId = topic.split(' | ')[0];
                return userId === interaction.user.id;
            }
            return false;
        });

        if (existingTicket) {
            return interaction.reply({
                content: '<a:warn:1233294338491154496> **Zaten Açık Bir Talebiniz Bulunmaktadır.**',
                ephemeral: true,
            });
        }

        const cleanedUsername = interaction.user.username.replace(/\s/g, '');
        const channelName = `ticket・${cleanedUsername}`;
        const supportChannel = await guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            parent: parentCategory,
            topic: `${interaction.user.id} | ${categoryName}`,
            permissionOverwrites: [
                {
                    id: interaction.user.id,
                    allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.AttachFiles],
                },
                {
                    id: ayarlar.Yetkiler.yetkili,
                    allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory],
                },
                {
                    id: guild.roles.everyone,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
            ],
        });

        const embed = new EmbedBuilder()
            .setColor('#141212')
            .setAuthor({
                name: `ʀᴇᴠᴇʀꜱᴇ`,
                iconURL: ayarlar.Resimler.moderasyonURL,
            })
            .setDescription(`<a:poofpinkheart:1233294316945014855> *・Lütfen yetkililerimizin mesaj yazmasını beklemeden sorununuzu anlatınız.*

         <:8676gasp:1233279834600378441>  ・\`Destek Açan:・\` ${interaction.user.toString()}
            
           <a:5961darkbluetea:1233795662949388380> ・\`Kategori: ${categoryName}・\`
           <a:animated_clock29:1233283897660411964> ・\`Tarih: ${moment(Date.now()).format("LLL")}・\`
        `)
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setImage(`https://i.ibb.co/qkvSTgm/Ekran-g-r-nt-s-2024-07-20-191822.png`);

        const kapat = new ButtonBuilder()
            .setCustomId('kapat')
            .setLabel(' Ticketi Kapat')        
            .setStyle('2');

        const actionRow = new ActionRowBuilder()
            .addComponents(kapat);

        supportChannel.send({ content: `${interaction.user.toString()} | <@&${ayarlar.Yetkiler.yetkili}>`, embeds: [embed], components: [actionRow] });

        openTickets.set(supportChannel.id, interaction.user);
        const ticketaçıldı = new EmbedBuilder()
            .setColor('#141212')
            .setAuthor({
                name: `ʀᴇᴠᴇʀꜱᴇ`,
                iconURL: ayarlar.Resimler.moderasyonURL,
            })
            .setDescription(`
                <:1709locked:1233279435692572683> ・\`Destek Kanalı:・\` <#${supportChannel.id}>
            `);

        interaction.reply({
            embeds: [ticketaçıldı],
            ephemeral: true
        });
    }
};
