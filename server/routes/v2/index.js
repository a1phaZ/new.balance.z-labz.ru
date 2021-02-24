const express = require('express');
const router = express.Router();

router.use('/accounts', require('../v2/accounts'));
router.use('/budgets', require('../v2/budgets'));

module.exports = router;
