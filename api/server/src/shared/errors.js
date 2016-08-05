'use strict'
Error.prototype.toString = function(){
		return this.stack.toString();
}

class GenericError extends Error{
    constructor(msg, innerError){
        super(msg);
        if(innerError)
            this.innerError = innerError;
    }
    toString(){
        var s = this.stack.toString();
        var inner = error.innerError;
        while(inner && inner.stack){
            s += "\n\n    innerError: " + inner.stack.toString();
            inner = inner.innerError;
        }
        return s;
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