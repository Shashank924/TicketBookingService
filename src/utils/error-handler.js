class AppError extends Error {
    constructor(message , explanation , statusCode) {
        super();
        this.message = message;
        this.explanation = explanation;
        this.statusCode = statusCode;
    }
}

module.exports = AppError;