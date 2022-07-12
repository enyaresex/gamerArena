const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PastActivitySchema = new Schema ({
    userId: {
        type: Schema.Types.ObjectId
    },
    activities : [{
        gameId : {type: Schema.Types.ObjectId},
        type : {type: Number},
        status: {type: Number},
        score: {type: Number},
        prizeType : {type: Schema.Types.ObjectId},
        prizeCount : {type: Schema.Types.Decimal128}
    }]
});

module.exports = mongoose.model('pastActivity', PastActivitySchema);
