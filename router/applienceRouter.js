const router = require("express").Router();
const Appliences = require('../models/Appliences');

router.get('/appliences', async (req, res) => {
    try {
        const appliences = await Appliences.find();

        if (appliences.length === 0) {
            return res.status(404).json({
              status: 'fail',
              message: 'No appliances found',
            });
        }
      
        res.status(200).json({
            status: 'success',
            appliances: appliences,
        });
        
    }catch(error) {
        console.log(error);
        return res.status(500).json({ 
            message: 'Internal server error' 
        });
    }
});

module.exports = router;
