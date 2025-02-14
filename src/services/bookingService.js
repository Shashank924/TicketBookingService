const BookingRepository = require('../repositories/bookingRepository');
const axios = require('axios');
const { FLIGHT_SERVICE_PATH } = require('../config/serverConfig');

const AppError = require('../utils/error-handler');

class BookingService {

    constructor() {
        this.bookingRepositoryObj = new BookingRepository();
    }

    async createBooking(data) {
        try {

            const flightId = data.flightId;
            const response = await axios.get(`${FLIGHT_SERVICE_PATH}/api/v1/flight/${flightId}`);
            const flightData = response.data.data;

            if(data.noOfSeats > flightData.totalSeats) {
                throw new AppError(
                    'Something went wrong',
                    'The required number of seats are not available',
                    500
                )
            }
    
            const totalPrice = data.noOfSeats * flightData.price;
            const bookingPayload = { ...data , totalCost : totalPrice};
    
            const booking = await this.bookingRepositoryObj.createBooking(bookingPayload);
    
            flightData.totalSeats -= data.noOfSeats;

            const flight = await axios.patch(`${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}` , flightData);
            
            return booking;
            
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}


module.exports = BookingService;