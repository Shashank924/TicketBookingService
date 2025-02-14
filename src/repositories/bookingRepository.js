const { ValidationError , InternalServerError } = require('../utils/index');
const { Booking } = require('../models/index');

class BookingRepository {

    async createBooking(data) {

        try {
            const booking = await Booking.create(data);
            return booking;
        } catch (error) {
            if(error.name === 'SequelizeValidationError') {
                throw new ValidationError(error);
            }
            throw new InternalServerError(error);
        }
    }
}

module.exports = BookingRepository;