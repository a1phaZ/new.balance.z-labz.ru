const mongoose = require('mongoose');
const {Schema, model} = mongoose;
mongoose.Promise = global.Promise;

const UserSchema = new Schema({
    userId: {type: Number, required: [true, 'Отсутствует идентификатор пользователя']},
    sessionData: [
        {
            timeStamp: {type: Number, default: +new Date()},
            userAgent: {type: String, default: 'unknown'}
        }
    ],
    ref: {type: Number},
    isMemberGroup: {type: Boolean, default: false},
    notification: {type: Boolean, default: false}
}, {timestamps: true});

const User = model('User', UserSchema);

module.exports = User;
