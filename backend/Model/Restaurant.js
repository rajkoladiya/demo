const { ObjectId } = require('mongoose');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var RestaurantSchema = new Schema({
    bookings: [{
        tableNo: {
            type: String,
            required: true,
        },
        noOfSeats: {
            type: String
        },
        tableId: {
            type: mongoose.Schema.Types.ObjectId 
        }
    }]

}, {
    timestamps: { createdAt: true, updatedAt: false }
})

RestaurantSchema.pre('save', function(next) {
    // do stuff
    
    next();
  });

const Restaurant = mongoose.model('restaurant', RestaurantSchema)
module.exports = Restaurant;