const mongoose = require('mongoose');

const etkinlikSchema = new mongoose.Schema({
    etkinlikIsmi: {
        type: String,
        required: true,
        unique: true
    },
    katılacakKisiSayısı: {
        type: Number,
        required: true
    },
    katılanlar: {
        type: [String],
        default: []
    },
    tamamlandı: {
        type: Boolean,
        default: false
    },
    id: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});

const Etkinlik = mongoose.model('Etkinlik', etkinlikSchema);
module.exports = { Etkinlik };
