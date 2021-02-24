const express = require('express');
const router = express.Router();

router.get('/', require('../accounts/getAccounts'));
router.get('/:id', require('../accounts/getAccount'));
router.post('/', require('../accounts/addAccount'));
router.patch('/:id', require('../accounts/updateAccount'));
router.delete('/:id', require('../accounts/deleteAccount'));
router.post('/transfer', require('../accounts/transfer'));

module.exports = router;
