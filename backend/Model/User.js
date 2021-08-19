const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    isverified:{
        type:Boolean,
        default: true
    },
    managerName: {
        type: String
    },
    restaurantName:{
        type: String
    },
    restaurantId:{
        type: String,
        ref: 'restaurant'
    },
    phone:{
        type: String
    },
    Verifytoken: {
        type: String,
     //   default: Math.random().toString(36).replace('0.', ''),
        unique: true
    }

})

const User = mongoose.model('users', UserSchema)
module.exports = User;