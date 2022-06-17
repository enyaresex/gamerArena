const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
    nickname : {
        type: String,
        required: true,
        unique : true
    },
    nameSurname: {
        type: String
    },
    email:{
        type: String
    },
    password: {
        type: String,
        required: true
    },
    avatar : {
        type : string
    },
    birthDate: {
        type : Date
    },
    country : {
        type: Number
    },
    experience : {
        type: Schema.Types.Decimal128
    },
    statistics : [{
        gameId : {type: Schema.Types.ObjectId},
        league : {type: Number},
        highestScore: {type: Number},
        conditionRate: {type: Number}
    }]
});

module.exports = mongoose.model('user', UserSchema);