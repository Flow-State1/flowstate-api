const mongoose = require('mongoose');

const pwrFiguresSchema = mongoose.Schema({
    date: {type: Date, required: true},
    kWh: {type: String, required: true}
});

module.exports = mongoose.model('Figures', pwrFiguresSchema);