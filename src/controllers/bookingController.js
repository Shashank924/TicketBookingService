const BookingService = require('../services/bookingService');

const bookingServiceObj = new BookingService();

const create = async (req , res) => {
    try {
        const bookingDetails = await bookingServiceObj.createBooking(req.body);
        return res.status(201).json({
            data : bookingDetails,
            message : 'Succesfully booked the flight',
            err : {}
        })
    } catch (error) {
        return res.status(error.statusCode).json({
            data : {},
            message : 'Not able to book flight',
            explanation : error.explanation,
            err : error
        })
    }
}

module.exports = {
    create
}