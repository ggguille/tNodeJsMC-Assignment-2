const HttpRequestHandler = require('../server/httpRequestHandler');
const Middleware = HttpRequestHandler.Middleware;
const Handler = HttpRequestHandler.Handler;

class AuthoritationMiddleware extends Middleware {
    static getName() {
        return 'authoritation';
    }

    constructor(dataModelProvider) {
        super(AuthoritationMiddleware.getName());
        this._dataModelProvider = dataModelProvider;
    }

    handle({headers, data}, handler) {
        // Get the token & user from the headers
        const token = typeof(headers.token) === 'string' ? headers.token : false;
        const user = typeof(headers.user) === 'string' ? headers.user : false;
        if (token && user) {
            const tokenDataModel = this._dataModelProvider.tokens;
            return tokenDataModel.get(token).then((tokenModel) => {
                // Check that the token is for the given user and has not expired
                if (tokenModel && 
                    tokenModel.user === user && 
                    tokenModel.expires > Date.now()
                ) {
                    if (Handler.validate(handler)) {
                        return handler.handle({
                            'headers': headers, 
                            'data': data
                        });
                    } else {
                        return Promise.resolve({
                            'statusCode': 500,
                            'data': {'message': 'Middleware error: Is not a handler'}
                        });
                    }
                } else {
                    return Promise.resolve({
                        'statusCode': 403,
                        'data': {'message': 'Unauthorized'}
                    });
                }
            });
        } else {
            return Promise.resolve({
                'statusCode': 403,
                'data': {'message': 'Unauthorized'}
            });
        }
    }
}

module.exports = AuthoritationMiddleware;