const Consumptions = require('../models/consumption');

const getAllConsumptions = (req, res) => {
    Consumptions.find().then((consumptions) => {
        res.status(200).json(consumptions);
    }).catch((error) => {
        res.status(400).json({
            status: 'fail',
            message: error,
        });
    });
};

module.exports = {
    getAllConsumptions
};