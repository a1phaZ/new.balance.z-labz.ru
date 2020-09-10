const express = require('express');
const router = express.Router();

router.use('/money-box', require('./moneybox'));

module.exports = router;