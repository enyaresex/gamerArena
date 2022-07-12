const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema ({
    logs: {
        type: Object
    },
    registrationDate : {
        type : Date,
        default: Date.now
    },
    types: {
        type: Number
    }
});

module.exports = mongoose.model('log', logSchema);