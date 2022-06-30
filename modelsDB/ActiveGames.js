const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActiveGameSchema = new Schema({
    gameId : {
        type: Schema.Types.ObjectId
    },
    endTime : {
        type: Date },
    league : {
        type: Number
        },
    mode : {
        type:  Number
    },
    players: [{
        nickname: {
            type: String
        },
        userId: {
            type: Schema.Types.ObjectId
        },
        score: {
            type: Number
        },
        avatar : {
            type : String
        }
    }],
    prize : [{
        types: {
            type: Schema.Types.ObjectId
        },
        count: {
            type: Schema.Types.Decimal128
        }
    }] ,
    gameData: {
        type: Object
    },
    scoreCalculation:[{
        rank : {
            type: Number
        },
        rate :{
            type: Schema.Types.Decimal128} 
    }]
           
});

module.exports = mongoose.model('activeGame',ActiveGameSchema);