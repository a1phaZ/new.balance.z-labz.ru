const express = require('express');
const router = express.Router();

router.get('/:id', require('./getItem'));
router.post('/', require('./addItem'));

module.exports = router;