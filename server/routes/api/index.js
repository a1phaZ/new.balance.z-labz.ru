const express = require('express');
const {getState} = require("./state");
const {
    postUserInfo,
    getAllUserRawSessionData,
    getAllUserSessionDataFromTimestamp,
    getNewUserFromTimestamp
} = require('./user');
const router = express.Router();

router.get('/state', postUserInfo, getState);
router.get('/user-session-data', getAllUserRawSessionData);
router.get('/user-session-data-ts', getAllUserSessionDataFromTimestamp);
router.get('/user-new-data', getNewUserFromTimestamp)
router.use('/money-box', require('./moneybox'));
router.use('/item', require('./item'));
router.use('/budget', require('./budget'));
router.use('/shoplist', require('./shoplist'));

module.exports = router;