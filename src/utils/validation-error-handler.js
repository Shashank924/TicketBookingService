const { StatusCodes } = require('http-status-codes');
const AppError = require('./error-handler');

class ValidationError extends AppError {

    constructor(error) {
        let explanation = [];
        error.errors.forEach((err) => {
            explanation.push(err.message);
        });
        super(
            'Please check the input provided',
            explanation,
            StatusCodes.BAD_REQUEST
        )
    }
}

module.exports = ValidationError;