const express = require('express');
const router = express.Router();

router.get('/:id', require('./getItem'));
router.post('/', require('./addItem'));
router.patch('/:id', require('./updateItem'));

module.exports = router;