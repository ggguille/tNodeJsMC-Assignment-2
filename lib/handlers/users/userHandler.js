const Handler = require('../../server/httpRequestHandler').Handler;

class UserHandler extends Handler {

    constructor(dataModelProvider, method = 'GET') {
        super('user', method);
        this._dataModelProvider = dataModelProvider;
    }

    handle({headers, data}) {
        return Promise.resolve({
            'statusCode': 200,
            'data': {'message': 'User handler works!'}
        });
    }
}

module.exports = UserHandler;