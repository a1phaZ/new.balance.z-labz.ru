const express = require('express');
const router = express.Router();

router.get('/', require('./getAccounts'));
router.get('/:id', require('./getAccount'));
router.post('/', require('./addAccount'));
router.patch('/:id', require('./updateAccount'));
router.delete('/:id', require('./deleteAccount'));
router.post('/transfer', require('./transfer'));

module.exports = router;
