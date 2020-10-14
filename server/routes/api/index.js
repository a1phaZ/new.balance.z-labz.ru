const express = require('express');
const router = express.Router();

router.use('/state', require('./state'));
router.use('/money-box', require('./moneybox'));
router.use('/item', require('./item'));
router.use('/budget', require('./budget'));

module.exports = router;