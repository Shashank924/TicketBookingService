const { StatusCodes } = require('http-status-codes');
const AppError = require('./error-handler');

class InternalServerError extends AppError {

    constructor(error) {
        let explanation = [];
        error.errors.forEach((err) => {
            explanation.push(err.message);
        });
        super(
            'Something went wrong at server side',
            explanation,
            StatusCodes.INTERNAL_SERVER_ERROR
        )
    }
}

module.exports = InternalServerError;