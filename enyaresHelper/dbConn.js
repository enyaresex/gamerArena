const mongoose = require('mongoose');
module.exports = () => {
    mongoose.connect('mongodb+srv://enyares:bk5409362@cluster0.0p2xw.mongodb.net/?retryWrites=true&w=majority')
    mongoose.connection.on('open', () =>{
        console.log('MongoDB: Connected');
    });
    mongoose.connection.on('error', (err) =>{
        console.log('MongoDB: Not Connected');
    });
};