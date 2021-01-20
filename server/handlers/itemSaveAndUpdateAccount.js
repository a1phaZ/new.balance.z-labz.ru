const {getMongooseError} = require("./error");
const {setErrorStatusCodeAndMessage} = require("./error");
const MoneyBox = require('../models/moneybox');

async function itemSaveAndUpdateAccount(item, userId, id) {
    return await item.save()
        .then(response => response._id)
        .then(async () => await MoneyBox.findOne({userId: userId, _id: id}))
        .then(box => {
            if (!box) {
                return Promise.reject(createError(404, 'Счет не найден'));
            }
            return box;
        })
        .then(async box => {
            box.operations = [...box.operations, item._id];
            box.$sum = item.sum;
            box.$income = item.income;
            return await box.save();
        })
        // .then(async box => await MoneyBox.findById(box._id).populate('operations'))
        .then((result) => {
            // req.message = 'Запись сохранена';
            return result;
        })
        .catch(err => {
            if (err.errors) {
                return createError(400, getMongooseError(err))
            }
            if (err.reason) {
                const e = setErrorStatusCodeAndMessage(err);
                return createError(e.statusCode, e.message);
            }
            return createError(err.statusCode, err.message)
        });
}

module.exports = {
    itemSaveAndUpdateAccount
}