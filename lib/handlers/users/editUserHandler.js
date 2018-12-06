const UserHandler = require('./userHandler');

class EditUserHandler extends UserHandler {
    constructor(dataModelProvider) {
        super(dataModelProvider, 'PUT');
    }

    handle({headers, data}) {
        const userDataModel = this._dataModelProvider.users;
        return userDataModel.update(headers.user, data).then(() => {
            return {
                'statusCode': 200,
                'data': {
                    'user_id': headers.user
                }
            };
        }).catch((err) => {
            return {
                'statusCode': 500,
                'data': {'message': err}
            };
        });
    }
}

module.exports = EditUserHandler;