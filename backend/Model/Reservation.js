const { ObjectId } = require('mongoose');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ReservationSchema = new Schema({
    name: {
        type: String,
    },
    time: {
        type: Date
    },
    noOfSeats: {
        type: Number
    },
    tableId: {
        type: String
    },
    restaurantId: {
        type: String,
        ref: 'restaurant'
    },



},{
    timestamps: { createdAt: true, updatedAt: false }
})


// ReservationSchema.virtual('tableId', {
//     ref: 'restaurant',
//     localField: 'tableId',
//     justOne: true,
//     foreignField: 'bookings.tableId',
// });

// ReservationSchema.virtual('restaurantId', {
//     ref: 'restaurant',
//     localField: 'restaurantId',
//     justOne: true,
//     foreignField: '_id',
// });


ReservationSchema.pre('save', function(next) {
    // do stuff
    next();
  });

const User = mongoose.model('reservation', ReservationSchema)
module.exports = User;