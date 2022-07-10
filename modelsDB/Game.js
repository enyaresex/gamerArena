const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new Schema ({
    name : {
        type: String,
        unique : true
    },
    code: {
        type: String
    },
    url:{
        type: String
    },
    avatar: {
        type: String
    }
});

module.exports = mongoose.model('game', GameSchema);