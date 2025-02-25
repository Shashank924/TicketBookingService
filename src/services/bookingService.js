const axios = require('axios');

const BookingRepository = require('../repositories/bookingRepository');
const { FLIGHT_SERVICE_PATH } = require('../config/serverConfig');

const { createChannel , publishMessage } = require('../utils/messageQueues');
const { REMINDER_BINDING_KEY } = require('../config/serverConfig');

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

            await this.sendMessageToQueue(flightData,data.userEmail);
            
            return booking;
            
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async sendMessageToQueue(flighData , userEmail) {
        try {
            const channel = await createChannel();
            const notificationData1 = {
                data : {
                    subject : 'Ticket booked successfully',
                    content : 'Your ticket has been booked succesfully. You can find your flight details below',
                    recipientMail : userEmail,
                    timestamp : new Date()
                },
                service : 'Confirmation Mail'
            }
            const notificationData2 = {
                data : {
                    subject : 'Flight Reminder',
                    content : 'This is a reminder about your flight. You can find your flight details below ',
                    recipientMail : userEmail,
                    timestamp : flighData.departureTime
                },
                service : 'Flight Reminder'
            }
            await publishMessage(channel , REMINDER_BINDING_KEY , JSON.stringify(notificationData1));
            await publishMessage(channel , REMINDER_BINDING_KEY , JSON.stringify(notificationData2));
        } catch (error) {
            throw error;
        }
    }
}


module.exports = BookingService;