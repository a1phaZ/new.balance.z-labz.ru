const express = require('express');
const {getState} = require("./state");
const {postUserInfo, getAllUserRawSessionData} = require('./user');
const router = express.Router();

router.get('/state', postUserInfo, getState);
router.get('/user-session-data', getAllUserRawSessionData);
router.use('/money-box', require('./moneybox'));
router.use('/item', require('./item'));
router.use('/budget', require('./budget'));
router.use('/shoplist', require('./shoplist'));

module.exports = router;