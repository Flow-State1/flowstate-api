const mongoose = require('mongoose');

const pwrFiguresSchema = mongoose.Schema({
    kwh: {type: String, required: true},
    date: {type: Date, required: true}
});

module.exports = mongoose.model('Figures', pwrFiguresSchema);