const express = require('express');
const {getState} = require("./state");
const router = express.Router();

router.get('/state', getState);
router.use('/money-box', require('./moneybox'));
router.use('/item', require('./item'));
router.use('/budget', require('./budget'));
router.use('/shoplist', require('./shoplist'));

module.exports = router;