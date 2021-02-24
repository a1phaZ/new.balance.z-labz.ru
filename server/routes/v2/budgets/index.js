const express = require('express');
const router = express.Router();

router.get('/', require('./getBudgets'));
router.get('/:id', require('./getBudget'));
router.post('/', require('./addBudget'));
router.patch('/:id', require('./updateBudget'));
router.delete('/:id', require('./deleteBudget'));

module.exports = router;