const express = require('express');
const router = express.Router();

router.use('/accounts', require('./accounts'));
router.use('/budgets', require('./budgets'));
router.use('/items', require('./items'));
router.use('/stats', require('./stats'));

module.exports = router;
