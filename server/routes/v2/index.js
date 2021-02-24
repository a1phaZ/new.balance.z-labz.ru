const express = require('express');
const router = express.Router();

router.use('/accounts', require('../v2/accounts'));

module.exports = router;
