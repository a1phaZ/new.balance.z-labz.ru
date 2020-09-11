const express = require('express');
const router = express.Router();

router.use('/money-box', require('./moneybox'));
router.use('/item', require('./item'));

module.exports = router;