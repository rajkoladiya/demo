const mongoose = require('mongoose');
const { MONGO_URI } = require('./../constant')


mongoose.connect(MONGO_URI,  { useNewUrlParser: true });
// When successfully connected
mongoose.connection.on('connected', () => {
    console.log('Established Mongoose Default Connection',process.env.MONGO_URI);
});

// When connection throws an error
mongoose.connection.on('error', err => {
    console.log('Mongoose Default Connection Error : ' + err);
});
