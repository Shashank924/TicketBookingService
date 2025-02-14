const { StatusCodes } = require('http-status-codes');
const AppError = require('./error-handler');

class InternalServerError extends AppError {

    constructor(error) {
        super(
            'Something went wrong at server side',
            'Please try after Sometime',
            StatusCodes.INTERNAL_SERVER_ERROR
        )
    }
}

module.exports = InternalServerError;