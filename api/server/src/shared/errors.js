'use strict'
class GenericError extends Error{
    constructor(msg, innerError){
        super(msg);
        if(innerError)
            this.innerError = innerError;
    }
}

class ValidationError extends GenericError{
    constructor(code, msg){
        super(msg);
        this.code = code;
    }
}

class ForbiddenError extends GenericError{
}

class NotFoundError extends GenericError{
}

module.exports = {
    GenericError: GenericError,
    ValidationError: ValidationError,
    ForbiddenError: ForbiddenError,
    NotFoundError: NotFoundError
}