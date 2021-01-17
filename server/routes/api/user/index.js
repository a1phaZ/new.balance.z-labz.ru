const User = require('../../../models/user');
const endOfDay = require('date-fns/endOfDay');
const startOfDay = require('date-fns/startOfDay');
const endOfMonth = require('date-fns/endOfMonth');
const startOfMonth = require('date-fns/startOfMonth');
const {createError} = require('../../../handlers/error');

/**
 * Получение временного периода
 * @param ts: Number - timestamp для получения периода
 * @param opt {{ts: Boolean, month: Boolean, day: Boolean}}
 * @returns {{end: Number | Date, begin: Number | Date}}
 */
const getDateRange = (ts, opt) => {
    const beginDay = !opt.ts ? startOfDay(new Date(ts)) : startOfDay(+new Date(ts));
    const endDay = !opt.ts ? endOfDay(new Date(ts)) : endOfDay(+new Date(ts));
    const beginMonth = !opt.ts ? startOfMonth(new Date(ts)) : startOfMonth(+new Date(ts));
    const endMonth = !opt.ts ? endOfMonth(new Date(ts)) : endOfMonth(+new Date(ts));

    if (opt.month) {
        return {
            begin: beginMonth,
            end: endMonth
        }
    }
    return {
        begin: beginDay,
        end: endDay
    }
}

/**
 * Функция записи данных о пользователе
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const postUserInfo = async (req, res, next) => {
    let {
        query: {
            vk_user_id,
            vk_ts,
            vk_platform
        }
    } = req;

    if (!vk_ts) {
        vk_ts = +new Date();
    } else {
        vk_ts *= 1000;
    }

    await User.findOne({userId: vk_user_id})
        .then(async user => {
            if (!user) {
                const newUser = new User({
                    userId: vk_user_id,
                    sessionData: [
                        {
                            timeStamp: vk_ts,
                            userAgent: vk_platform
                        }
                    ]
                });
                newUser.save();
                return next();
            } else {
                const {sessionData} = user;
                const index = sessionData.findIndex(session => session.timeStamp === vk_ts);
                if (index === -1) {
                    sessionData.push({timeStamp: vk_ts, userAgent: vk_platform});
                }
                /***
                 * Здесь должна быть обработка других параметров
                 */
                await User.findOneAndUpdate(
                    {userId: vk_user_id},
                    {
                        $set: {
                            sessionData: sessionData,
                        }
                    },
                    {new: true}
                );
                return next();
            }
        })
}

/**
 * Функция возвращает данные о всех пользователях
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const getAllUserRawSessionData = async (req, res, next) => {
    await User.find()
        .then(users => {
            const sessionData = users.map(user => {
                {
                    return {
                        userId: user.userId, sessionData: user.sessionData
                    }
                }
            })
            res.status(200).json(sessionData);
        })
        .catch(
            () => {
                next(createError(400, 'Возникла проблема'))
            }
        );
}

/**
 * Функция возвращает данные о пользователях за период времени
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const getAllUserSessionDataFromTimestamp = async (req, res, next) => {
    let {
        query: {
            ts = +new Date(),
            day = false,
            month = false
        }
    } = req;
    const dateRange = getDateRange(+ts, {day: day, month: month, ts: true});
    await User.find({'sessionData.timeStamp': {$gte: dateRange.begin, $lte: dateRange.end}})
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((err) => {
            console.log(err);
            next(createError(400, 'Что-то пошло не так'));
        })
}

/**
 * Функция возвращает данные о новых пользователях за период
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const getNewUserFromTimestamp = async (req, res, next) => {
    let {
        query: {
            ts = +new Date(),
            day = false,
            month = false
        }
    } = req;
    const dateRange = getDateRange(+ts, {day: day, month: month, ts: false});
    await User.find({createdAt: {$gte: dateRange.begin, $lte: dateRange.end}})
        .then(users => res.status(200).json(users))
        .catch(err => {
            console.log(err);
            next(createError(400, 'Что-то пошло не так'));
        })
}

module.exports = {
    postUserInfo,
    getAllUserRawSessionData,
    getAllUserSessionDataFromTimestamp,
    getNewUserFromTimestamp
}