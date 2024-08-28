    const { SlashCommandBuilder } = require('@discordjs/builders');
    const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
    const canvafy = require('canvafy');
    const { Etkinlik } = require('../../database/Etkinlik.');
    const { v4: uuidv4 } = require('uuid');

    module.exports = {
        data: new SlashCommandBuilder()
            .setName('etkinlik-oluştur')
            .setDescription('Etkinlik oluşturmak için komutu kullanın.')
            .addStringOption(option =>
                option.setName('etkinlik-ismi')
                    .setDescription('Etkinliğin adını yazınız!')
                    .setRequired(true)
            )
            .addStringOption(option =>
                option.setName('katılacak-üye-sayısı')
                    .setDescription('Etkinliğe kaç kişi katılacağını yazınız!')
                    .setRequired(true)
            ),
        async run(client, interaction) {
            const etkinlikIsmi = interaction.options.getString('etkinlik-ismi');
            const katılacakKisiSayısı = parseInt(interaction.options.getString('katılacak-üye-sayısı'));

            if (!etkinlikIsmi || isNaN(katılacakKisiSayısı)) {
                return interaction.reply({ content: "Geçersiz etkinlik ismi veya üye sayısı!", ephemeral: true });
            }

            try {
                // Aktif bir etkinlik olup olmadığını kontrol et
                const aktifEtkinlik = await Etkinlik.findOne({ tamamlandı: { $ne: true } });
                if (aktifEtkinlik) {
                    return interaction.reply({ content: "Şu anda aktif bir etkinlik var. Lütfen önce mevcut etkinliği tamamlayın.", ephemeral: true });
                }

                const uniqueEtkinlikIsmi = `${etkinlikIsmi}_${uuidv4()}`;

                const mevcutEtkinlik = await Etkinlik.findOne({ etkinlikIsmi: uniqueEtkinlikIsmi });
                if (mevcutEtkinlik) {
                    return interaction.reply({ content: "Aynı isimde başka bir etkinlik zaten oluşturuldu!", ephemeral: true });
                }

                const etkinlik = new Etkinlik({
                    etkinlikIsmi: uniqueEtkinlikIsmi,
                    katılacakKisiSayısı,
                    id: interaction.id,
                    oluşturulanKisi: interaction.user.id, // Etkinliği oluşturan kişinin ID'si
                    katılanlar: []
                });
                await etkinlik.save();

                await interaction.deferReply();

                // Etkinliği oluşturan kişinin ismini almak
                const oluşturanKisi = interaction.user.username;

                // Görsel oluşturma ve üzerine metin ekleme
                const görsel = await new canvafy.WelcomeLeave()
                    .setAvatar('https://i.ibb.co/h1nBFsq/bbs.png')
                    .setBackground("image", 'https://i.ibb.co/h1nBFsq/bbs.png')
                    .setTitle(`Etkinlik: ${etkinlikIsmi}`)
                    .setDescription(`Oluşturan: ${oluşturanKisi}\nKatılan: 0/${katılacakKisiSayısı}`)
                    .setBorder("#0a0a0a")
                    .setAvatarBorder("#0a0a0a")
                    .setOverlayOpacity(0.6)
                    .build();

                const katılButonu = new ButtonBuilder()
                    .setCustomId(`katil_${interaction.id}`)
                    .setLabel(" ᴇᴛᴋıɴʟıɢᴇ ᴋᴀᴛıʟ")
                    .setEmoji("<a:grsaqw:1233294278881443861>")
                    .setStyle(ButtonStyle.Primary);

                const ayrılButonu = new ButtonBuilder()
                    .setCustomId(`ayril_${interaction.id}`)
                    .setLabel(" ᴇᴛᴋıɴʟıᴋᴛᴇɴ ᴀʏʀıʟ")
                    .setEmoji("<a:cikisaw:1233284107304439889>")
                    .setStyle(ButtonStyle.Danger);

                const sonlandırButonu = new ButtonBuilder()
                    .setCustomId(`sonlandir_${interaction.id}`)
                    .setLabel("ᴇᴛᴋıɴʟıɢı ꜱᴏɴʟᴀɴᴅıʀ")
                    .setEmoji("<a:closex:1233284111893004311>")
                    .setStyle(ButtonStyle.Secondary);

                const row = new ActionRowBuilder()
                    .addComponents(katılButonu, ayrılButonu, sonlandırButonu);

                await interaction.editReply({ files: [{ attachment: görsel, name: "etkinlik.png" }], components: [row] });

                const filter = i => (i.customId.startsWith('katil_') || i.customId.startsWith('ayril_') || i.customId.startsWith('sonlandir_')) && !i.user.bot;
                const collector = interaction.channel.createMessageComponentCollector({ filter, time: 86400000 });

                collector.on('collect', async i => {
                    try {
                        const etkinlik = await Etkinlik.findOne({ id: interaction.id });
                        if (!etkinlik || etkinlik.tamamlandı) return;

                        if (i.customId.startsWith('katil_')) {
                            if (etkinlik.katılanlar.includes(i.user.id)) {
                                return i.reply({ content: "Zaten katıldınız!", ephemeral: true });
                            }

                            etkinlik.katılanlar.push(i.user.id);

                            if (etkinlik.katılanlar.length >= etkinlik.katılacakKisiSayısı) {
                                await Etkinlik.updateOne({ id: interaction.id }, { $set: { tamamlandı: true } });

                                const yeniGörsel = await new canvafy.WelcomeLeave()
                                    .setAvatar('https://i.ibb.co/h1nBFsq/bbs.png')
                                    .setBackground("image", 'https://i.ibb.co/h1nBFsq/bbs.png')
                                    .setTitle(etkinlikIsmi)
                                    .setDescription(`Etkinlik Tamamlandı`)
                                    .setBorder("#0a0a0a")
                                    .setAvatarBorder("#0a0a0a")
                                    .setOverlayOpacity(0.6)
                                    .build();

                                const etiketler = (await Promise.all(etkinlik.katılanlar.map(async (id, index) => {
                                    try {
                                        const member = await interaction.guild.members.fetch(id);
                                        return `${index + 1}. ${member ? member.toString() + ' | ' + id : id}`;
                                    } catch (error) {
                                        console.error('Kullanıcı alınamadı:', error);
                                        return id;
                                    }
                                }))).filter(tag => tag);

                                await i.update({
                                    content: `# <a:duyuru:1233294262049964043> Etkinlik Katılımcıları:\n${etiketler.join('\n')}`,
                                    files: [{ attachment: yeniGörsel, name: "etkinlik.png" }],
                                    components: []
                                });
                            } else {
                                await Etkinlik.updateOne({ id: interaction.id }, { $set: { katılanlar: etkinlik.katılanlar } });

                                const yeniGörsel = await new canvafy.WelcomeLeave()
                                    .setAvatar('https://i.ibb.co/h1nBFsq/bbs.png')
                                    .setBackground("image", 'https://i.ibb.co/h1nBFsq/bbs.png')
                                    .setTitle(etkinlikIsmi)
                                    .setDescription(`${etkinlik.katılanlar.length}/${etkinlik.katılacakKisiSayısı} kişi etkinliğe katıldı`)
                                    .setBorder("#0a0a0a")
                                    .setAvatarBorder("#0a0a0a")
                                    .setOverlayOpacity(0.6)
                                    .build();

                                const etiketler = (await Promise.all(etkinlik.katılanlar.map(async (id, index) => {
                                    try {
                                        const member = await interaction.guild.members.fetch(id);
                                        return `${index + 1}. ${member ? member.toString() + ' | ' + id : id}`;
                                    } catch (error) {
                                        console.error('Kullanıcı alınamadı:', error);
                                        return id;
                                    }
                                }))).filter(tag => tag);

                                await i.update({
                                    files: [{ attachment: yeniGörsel, name: "etkinlik.png" }],
                                    content: `${etkinlik.katılanlar.length}/${etkinlik.katılacakKisiSayısı} kişi etkinliğe katıldı`,
                                });
                            }
                        } else if (i.customId.startsWith('ayril_')) {
                            if (!etkinlik.katılanlar.includes(i.user.id)) {
                                return i.reply({ content: "Etkinliğe katılmadınız!", ephemeral: true });
                            }

                            etkinlik.katılanlar = etkinlik.katılanlar.filter(id => id !== i.user.id);

                            await Etkinlik.updateOne({ id: interaction.id }, { $set: { katılanlar: etkinlik.katılanlar } });

                            await i.reply({ content: "Etkinlikten ayrıldınız!", ephemeral: true });
                        } else if (i.customId.startsWith('sonlandir_')) {
                            if (i.user.id !== etkinlik.oluşturanKisi && !i.member.permissions.has('ADMINISTRATOR')) {
                                return i.reply({ content: "Bu etkinliği sonlandırmak için yetkiniz yok.", ephemeral: true });
                            }

                            await Etkinlik.updateOne({ id: interaction.id }, { $set: { tamamlandı: true } });

                            const yeniGörsel = await new canvafy.WelcomeLeave()
                                .setAvatar('https://i.ibb.co/h1nBFsq/bbs.png')
                                .setBackground("image", 'https://i.ibb.co/h1nBFsq/bbs.png')
                                .setTitle(etkinlikIsmi)
                                .setDescription("Etkinlik tamamlandı")
                                .setBorder("#0a0a0a")
                                .setAvatarBorder("#0a0a0a")
                                .setOverlayOpacity(0.6)
                                .build();

                            const etiketler = (await Promise.all(etkinlik.katılanlar.map(async (id, index) => {
                                try {
                                    const member = await interaction.guild.members.fetch(id);
                                    return `${index + 1}. ${member ? member.toString() + ' | ' + id : id}`;
                                } catch (error) {
                                    console.error('Kullanıcı alınamadı:', error);
                                    return id;
                                }
                            }))).filter(tag => tag);

                            await i.update({
                                content: `# <a:duyuru:1233294262049964043> Etkinlik Katılımcıları:\n${etiketler.join('\n')}`,
                                files: [{ attachment: yeniGörsel, name: "etkinlik.png" }],
                                components: []
                            });
                        }
                    } catch (error) {
                        console.error('Event Collector Error:', error);
                        await i.reply({ content: "Bir hata oluştu!", ephemeral: true });
                    }
                });

                collector.on('end', async () => {
                    const etkinlik = await Etkinlik.findOne({ id: interaction.id });
                    if (etkinlik && !etkinlik.tamamlandı) {
                        await Etkinlik.updateOne({ id: interaction.id }, { $set: { tamamlandı: true } });

                        const yeniGörsel = await new canvafy.WelcomeLeave()
                            .setAvatar('https://i.ibb.co/h1nBFsq/bbs.png')
                            .setBackground("image", 'https://i.ibb.co/h1nBFsq/bbs.png')
                            .setTitle(etkinlikIsmi)
                            .setDescription("Etkinlik süresi doldu")
                            .setBorder("#0a0a0a")
                            .setAvatarBorder("#0a0a0a")
                            .setOverlayOpacity(0.6)
                            .build();

                        const etiketler = (await Promise.all(etkinlik.katılanlar.map(async (id, index) => {
                            try {
                                const member = await interaction.guild.members.fetch(id);
                                return `${index + 1}. ${member ? member.toString() + ' | ' + id : id}`;
                            } catch (error) {
                                console.error('Kullanıcı alınamadı:', error);
                                return id;
                            }
                        }))).filter(tag => tag);

                        await interaction.editReply({
                            content: `# <a:duyuru:1233294262049964043> Etkinlik Katılımcıları:\n${etiketler.join('\n')}`,
                            files: [{ attachment: yeniGörsel, name: "etkinlik.png" }],
                            components: []
                        });
                    }
                });

            } catch (error) {
                console.error('Etkinlik oluşturulurken bir hata oluştu:', error);
                return interaction.reply({ content: "Etkinlik oluşturulurken bir hata oluştu!", ephemeral: true });
            }
        },
    };
