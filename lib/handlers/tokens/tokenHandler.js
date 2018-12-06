const Handler = require('../../server/httpRequestHandler').Handler;

class TokenHandler extends Handler {
    
    constructor(dataModelProvider, method = 'GET') {
        super('token', method);
        this._dataModelProvider = dataModelProvider;
    }

    handle({headers, data}) {
        return Promise.resolve({
            'statusCode': 200,
            'data': {'message': 'Token handler works!'}
        });
    }
}

module.exports = TokenHandler;