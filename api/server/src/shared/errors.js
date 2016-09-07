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
        var inner = this.innerError;
        while(inner){
            if(inner.stack)
                s += "\n\n    innerError: " + JSON.stringify(inner.stack);
            else
                s += "\n\n    innerError: " + inner;
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

class AuthorizationError extends GenericError{
}

class ForbiddenError extends GenericError{
}

class NotFoundError extends GenericError{
}

class BasGatewayError extends GenericError{
}

module.exports = {
    GenericError: GenericError,
    ValidationError: ValidationError,
    ForbiddenError: ForbiddenError,
    NotFoundError: NotFoundError,
    AuthorizationError: AuthorizationError,
    BasGatewayError: BasGatewayError
}