const express = require('express');
const router = express.Router();

router.use('/api', require('./api'));
router.use('/api/v2', require('./v2'));

module.exports = router;
