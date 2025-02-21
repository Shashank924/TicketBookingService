const BookingService = require('../services/bookingService');

const bookingServiceObj = new BookingService();

const { createChannel , publishMessage } = require('../utils/messageQueues');
const { REMINDER_BINDING_KEY } = require('../config/serverConfig');

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

const sendMessageToQueue = async (req , res) => {
    try {
        const channel = await createChannel();
        const data = { message : 'Success'};
        await publishMessage(channel , REMINDER_BINDING_KEY , JSON.stringify(data));
        return res.status(201).json({
            message : 'Succesfully published the message'
        })
    } catch (error) {
        return res.status(500).json({
            message : "not able to publish message",
            err : error
        })
    }
}

module.exports = {
    create,
    sendMessageToQueue
}