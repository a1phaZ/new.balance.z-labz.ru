const express = require('express');
const router = express.Router();

router.use('/money-box', require('./moneybox'));
router.use('/day', require('./day'));

module.exports = router;