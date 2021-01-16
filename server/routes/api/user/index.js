const User = require('../../../models/user');
const {createError} = require('../../../handlers/error');

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
 * Функция возвращает данные о пользователях
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

module.exports = {
    postUserInfo,
    getAllUserRawSessionData
}