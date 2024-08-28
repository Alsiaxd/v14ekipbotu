const { SlashCommandBuilder } = require('@discordjs/builders');
const { Etkinlik } = require('../../database/Etkinlik.');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('etkinlikiptal')
        .setDescription('Aktif etkinlikleri iptal eder.'),
    async run(client, interaction) {
        try {
            // Tamamlanmamış etkinlikleri bul
            const aktifEtkinlikler = await Etkinlik.find({ tamamlandı: { $ne: true } });

            if (aktifEtkinlikler.length === 0) {
                // Kullanıcıya yanıt olarak etkinlik bulunmuyor mesajı gönder
                return interaction.reply({ content: "Şu anda aktif bir etkinlik bulunmuyor.", ephemeral: true });
            }

            // Aktif etkinlikleri tamamla
            await Etkinlik.updateMany({ tamamlandı: { $ne: true } }, { $set: { tamamlandı: true } });

            // Kullanıcıya yanıt olarak etkinlik iptal edildi mesajı gönder
            return interaction.reply({ content: `${aktifEtkinlikler.length} etkinlik iptal edildi.`, ephemeral: true });
        } catch (error) {
            console.error("Hata oluştu:", error);
            return interaction.reply({ content: "Etkinlikleri iptal ederken bir hata oluştu, lütfen tekrar deneyin.", ephemeral: true });
        }
    }
};
