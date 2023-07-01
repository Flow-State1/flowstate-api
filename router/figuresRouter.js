const router = require('express').Router();
const figuresController = require('../controllers/figuresController');


//Fetching everything in the database
router.get('/', figuresController.get_records);

//Adding recorded unit to database
router.post('/record',figuresController.add_record );

//Finding records by specific date
router.get('/record/:date', figuresController.get_records_by_date);

//Finding records by range date 
router.get('/records/:date:date2', figuresController.get_records_by_dateRange);

module.exports = router;