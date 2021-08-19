'use strict'

const RestaurantModel = require('./../Model/Restaurant')
const ReservationModel = require('./../Model/Reservation')
const constant = require('./../Constant/index')
const responseService = require('./../service/responseService')
const moment = require('moment')

module.exports = {
   
    addTable: function (req, res) {
        return new Promise(async (resolve, reject) => {
            const { refId, noOfSeats, name } = req.body;
            const {_id, email, restaurantId} = req.userData;
            const refExist = await RestaurantModel.findOne({_id: restaurantId});
            const existing =  (refExist && refExist.bookings && refExist.bookings.length > 0 && (refExist.bookings.findIndex(el => el.tableNo == refId) > -1)) ? refExist.bookings.findIndex(el => el.tableNo == refId) : -1
            if(existing >= 0){
                // const restaurant = await ReservationModel.create({restaurantId, name: name, time: Date.now(), noOfSeats: noOfSeats, tableId: refExist.bookings[existindex].tableNo})
                const restUpdate = await RestaurantModel.updateOne({_id: restaurantId, 'bookings.tableNo': refId},  {
                    'bookings.$.noOfSeats': noOfSeats,
                    'bookings.$.name': name,
                });
                res.status(200)
                const response = responseService.success({msg: 'Table updated successfully', payload: restUpdate})
                resolve(response);
            } else {
                const restUpdate = await RestaurantModel.updateOne({_id: restaurantId},  {
                    $push: {
                        bookings: {
                            tableNo: refId,
                            noOfSeats: noOfSeats,
                            name: name,
                        }
                    }
                });
                res.status(200)
                const response = responseService.success({msg: 'Table added successfully', payload: restUpdate})
                resolve(response);
            }
        })
    },

    bookTable: function (req, res) {
        const { refId, noOfSeats, name, reserveTime } = req.body;
        const {_id, email, restaurantId} = req.userData;
        console.log('@@reserveTime', moment(reserveTime).utc())
        const bookTable  = ReservationModel.create({
            name: name, 
            time: moment(reserveTime).subtract(1, 'd').utc(),
            noOfSeats: noOfSeats, 
            tableId: refId,
            restaurantId: restaurantId
        })
        res.status(200)
        const response = responseService.success({msg: 'Reserve Table successfully', payload: bookTable})
        return response;
    },
    getTable: function (req, res) {
        return new Promise(async (resolve, reject) => {
            const { restaurantId} = req.userData;
            const bookTable  = await RestaurantModel.findOne({
                _id: restaurantId
            })
            res.status(200)
            const response = await responseService.success({msg: 'Table Data get successfully', payload: bookTable})
            console.log('@@response', response)
            resolve(response);
        })
    },

    getRestaurantsReservationData: function (req, res) {
        return new Promise(async (resolve, reject) => {
            const { refId, date } = req.body;
            const { restaurantId} = req.userData;
            // let minDate = moment(date).utc().startOf('day');
            // let maxDate = moment(date).utc().endOf('day');
            let minDate = moment(date).utc();//.subtract(1, 'd').utc();
            let maxDate = moment(date).add(2, 'd').utc();
            const reservationData  = await ReservationModel.find({
                restaurantId: restaurantId,
                tableId: refId,
                time: {
                    $gte: minDate,
                    $lt: maxDate
                }
            })
            res.status(200)
            const response = await responseService.success({msg: 'Table Data get successfully', payload: reservationData})
            resolve(response);
        })
    },

    deleteTable: function (req, res) {
        return new Promise(async (resolve, reject) => {
            const { refId } = req.params;
            const { restaurantId} = req.userData;
            const refExist = await RestaurantModel.findOne({_id: restaurantId, 'bookings.tableNo': refId});
            const existing =  (refExist && refExist.bookings && refExist.bookings.length > 0 && (refExist.bookings.findIndex(el => el.tableNo == refId) > -1)) ? refExist.bookings.findIndex(el => el.tableNo == refId) : -1
            if(existing >= 0){
                // const restaurant = await ReservationModel.create({restaurantId, name: name, time: Date.now(), noOfSeats: noOfSeats, tableId: refExist.bookings[existindex].tableNo})
                const restUpdate = await RestaurantModel.updateOne({_id: restaurantId, 'bookings.tableNo': refId},  {
                    $pull: {
                        bookings: {
                            tableNo: refId,
                        }
                    }
                });
                res.status(200)
                const response = responseService.success({msg: 'Table deleted successfully', payload: restUpdate})
                resolve(response);
            } else {
                res.status(404)
                const response = responseService.error({msg: 'No table found', payload: {}})
                resolve(response);
            }
        })
    },
}

