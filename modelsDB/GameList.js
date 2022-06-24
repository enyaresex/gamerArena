const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameList = new Schema({
    gameId : {
        type: Schema.Types.ObjectId
    },
    endTimeUp : {
        type: Number },
    prize : {
            types: {
                type: Schema.Types.ObjectId
            },
            count: {
                type: Schema.Types.Decimal128
            }
    },
    scoreCalculation:[{
        rank : {
            type: Number
        },
        rate :{
            type: Schema.Types.Decimal128} 
    }]   
});

module.exports = mongoose.model('gameList',GameList);
